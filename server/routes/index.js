import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import { S3Services } from 'appknit-backend-bundle';
import { VALID_VIDEO_EXTENSIONS, S3_BUCKET, S3_URL } from '../constants';
/**
 * this expression will auto deploy all the routes in this path
 */
export default (app) => {
	/**
	 * webhook to call once transcoding is finished
	 */
	app.get('/baremetal/:video', async (req, res) => {
		try {
			const { params: { video } } = req;
			if (!video) {
				return res.send({ error: 'Missing required video id.' });
			}
			const files = fs.readdirSync(path.resolve('uploads', video));
			const uploadPromises = [files.map(file => new Promise(async (resolve, reject) => {
				try {
					if (file === '.DS_Store' || file.substring(0, file.indexOf('.')) === video) {
						return resolve();
					}
					// trigger uploading to s3
					const extension = file.substring(file.indexOf('.') + 1, file.length);
					const mimeType = mime.contentType(extension);
					await S3Services.uploadPublicObject({
						Bucket: `${S3_BUCKET}/${video}`,
						Key: file,
						data: fs.readFileSync(path.resolve('uploads', video, file)),
						mime: mimeType,
					});
					return resolve();
				} catch (err) {
					console.log(err);
					return reject({ message: err.message, error: err });
				}
			}))];
			await Promise.all(uploadPromises);
			// remove the local folder
			// trigger uploading the contents of video into s3 bucket now
			return res.send('Uploaded Video. Video is ready to stream.');
		} catch (err) {
			return res.send(err);
		}
	});
	/**
	 * This will accept the incoming video file from front end
	 */
	app.post('/transcode', async (req, res) => {
		const { files: { file } } = req;
		if (!file) {
			return res.send({ error: 'No input file received. Please send video file in file in application/form-data format.' });
		}
		const { data, name, encoding, mimetype, size } = file;
		const extension = mime.extension(mimetype);
		/**
		 * Check for extension
		 */
		if (!extension || !VALID_VIDEO_EXTENSIONS.includes(extension)) {
			return res.send({ error: 'Video format is not supported.' });
		}
		// generare the unique id for this video.
		const videoId = uuidv4();
		/**
		 * Save the incoming file in uploads folder
		 */
		fs.mkdirSync(path.resolve('uploads', videoId));
		const videoFilePath = path.resolve('uploads', videoId, `${videoId}.${extension}`);
		fs.writeFileSync(videoFilePath, data);

		// exec(`.././create-hls-vod.sh ${videoId} ${extension} ${S3_BUCKET}`);
		const createHLSVOD = spawn('bash', ['create-hls-vod.sh', videoId, extension, S3_URL]);
		createHLSVOD.stdout.on('data', d => console.log(`stdout info: ${d}`));
		createHLSVOD.stderr.on('data', d => console.log(`stderr error: ${d}`));
		createHLSVOD.on('error', d => console.log(`error: ${d}`));
		createHLSVOD.on('close', code => console.log(`child process ended with code ${code}`));
		res.send('success');
	});
};
