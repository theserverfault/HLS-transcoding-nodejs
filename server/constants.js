export const {
	SECRET_STRING = 'r@nDOmSeCr3tStr!nG',
	S3_BUCKET,
	S3_URL,
} = process.env;

export const APP_VERSION = 1.0;
export const VALID_VIDEO_EXTENSIONS = [
	// MP4
	'mp4',
	'm4a',
	'm4v',
	'f4v',
	'f4a',
	'm4b',
	'm4r',
	'f4b',
	'mov',
	// 3GP
	'3gp',
	'3gp2',
	'3g2',
	'3gpp',
	'3gpp2',
	// OGG
	'ogg',
	'oga',
	'ogv',
	'ogx',
	// WMV
	'wmv',
	'wma',
	'asf',
	// WEBM
	'webm',
	// FLV
	'flv',
	// AVI
	'avi',
	// Quicktime
	'qt',
	// HDV
	'hdv',
	// MXF
	'OP1a',
	'OP-Atom',
	// MPEG-TS
	'ts',
	'mts',
	'm2ts',
	// WAV
	'wav',
	// Misc
	'lxf',
	'gxf',
	'vob',
];
