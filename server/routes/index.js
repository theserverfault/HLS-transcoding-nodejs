import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import { VALID_VIDEO_EXTENSIONS } from '../constants';
/**
 * this expression will auto deploy all the routes in this path
 */
export default (app) => {
	/**
	 * webhook to call once transcoding is finished
	 */
	app.get('/baremetal/:video', (req, res) => {
		const { params: { video } } = req;
		if (!video) {
			return res.send({ error: 'Missing required video id.' });
		}
		// trigger uploading the contents of video into s3 bucket now
		return res.send('Hello Bare Metal Express Server. I\'ve got your video id.');
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

		return res.send('success');
	});
};
