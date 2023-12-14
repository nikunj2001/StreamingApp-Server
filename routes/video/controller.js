const formidable = require('formidable');
const AWS = require('aws-sdk');
const fs = require('fs');

const Video = require('../../models/Video');

// TODO: Need to add then in configs, removing it for now 
const credentials = {
	accessKeyId: '',
	secretAccessKey: '',
	region: ''
}

AWS.config.update(credentials);
const s3 = new AWS.S3();

exports.uploadVideo = [
	async (req, res, next) => {
		try {
			const form = new formidable.IncomingForm();
			form.uploadDir = 'uploads';
			form.parse(req, async (error, fields, files) => {
				if (error) {
					return res.status(500).json({ data: { msg: 'Error uploading file' } });
				}
				const { title, subTitle } = fields;
				const { video: file } = files;
				const oldPath = file[0]?.filepath;
				const fileName = file[0]?.originalFilename;
				const newPath = `uploads/${fileName}`;
				fs.rename(oldPath, newPath, (renameErr) => {
					if (renameErr) {
						return res.status(500).json({ data: { msg: 'Error moving file to destination' } });
					}

					// Read the file content
					const fileContent = fs.readFileSync(newPath);

					// Define S3 upload parameters
					const params = {
						Bucket: 'myproject-videos',
						Key: fileName,
						Body: fileContent,
						ContentType: 'video/*',
						ACL: 'public-read'
					}

					// Upload the video to S3
					s3.upload(params, async (s3Err, data) => {
						if (s3Err) {
							console.error(s3Err);
							return res.status(500).json({ ok: false, data: { error: s3Err } });
						}

						// Delete the local file after uploading to S3
						fs.unlinkSync(newPath);

						// Save data in DB 

						const uploadedVideo = await Video.create({
							title: title[0],
							subTitle: subTitle[0],
							videoLink: data.Location,
							secretToken: 'asdadadadas',
							uploadedBy: req.admin._id
						});
						return res.status(200).json({ ok: true, uploadedVideo });
					});
				});
			})
		} catch (error) {
			next(error);
		}
	}];

exports.getVideos = async (req, res, next) => {
	try {
		const videos = await Video.find();
		const serializedVideos = videos.map((video) => ({
			id: video._id,
			title: video.title,
			subTitle: video.subTitle,
			videoLink: video.videoLink
		}));
		return res.status(200).json({ok: true, data: { videos: serializedVideos } })
	} catch (error) {
		next(error);
	}
}


