# HLS m3u8 streaming in NodeJS with ffmpeg and S3 Hosting
HLS stands for HTTP Live Streaming. It is an HTTP-based adaptive bitrate streaming communications protocol developed by Apple. It allows content to be delivered over HTTP-based CDNs using extended M3U playlists.
To learn more about HLS, consider visting [Wikipedia](https://en.wikipedia.org/wiki/HTTP_Live_Streaming).

This is an automated example implementation of HLS in NodeJS using ffmpeg.

## Process
### Accepting the video file.
Express server accepts the video and save it temporarily on the server. Few checks are made like checking the video format and mime-types. Garbage files are truncated.

### Renditions
Server triggers a shell script which handles the video for different renditions by keeping the aspect ratio of the video. The various renditions are:

- 640x360 resolution with 800k bitrate and 96k audio-birate --> *360p*
- 842x480 resolution with 1400k bitrate and 128k audio-birate --> *480p*
- 1280x720 resolution with 2800k bitrate and 128k audio-birate --> *720p*
- 1920x1080 resolution with 5000k bitrate and 192k audio-birate --> *1080p*

Though, these are pretty basic renditions. The renditions are static for now and could be dynamic based on initial video quality.
	
### Segments
The video is divided into 4 seconds segments intervals which will be loaded for each buffering units and the durations must be calculated on mean size of videos being uploaded because it cannot be too small or too large. Too short segment size will lead to too many segments to manage and hence larger buffer lookups. Too large segment size will fail for the smaller videos as they will always be loaded with single segment. The standard option is to have very small segment size for smaller videos. Whereas, the segment size of 4-6 seconds fits for all video types.

### Bitrate-Ratio
The bitrate ratio defines the maximum accepted birate fluctuations which is kept to 1.07.

### Rate Monitor Buffer Ratio
Maximum buffer size between bitrate conformance checks is set to 1.5 by default.

### Generating HLS VOD in ts and m3v8 playlist format
Using ffmpeg to trigger shell command to generate HLS VOD streams for the incoming video. Consider visiting [ffmpeg](https://www.ffmpeg.org/) webiste for details about the CMD tools and API.

The logs for shell command are handled via `spawn` and logged via basic `stdout` as of now. For production, we can use [netcat](https://www.digitalocean.com/community/tutorials/how-to-use-netcat-to-establish-and-test-tcp-and-udp-connections-on-a-vps) to communicate messages/status via TCP/UDP connection. We can utilize `sockets` connects on shell to let applications communicate for logs and statuses so that errors/success messages could be tracked.

> Following is the link to netcat cheatsheet:
> [netcat cheatsheet](https://www.sans.org/security-resources/sec560/netcat_cheat_sheet_v1.pdf)

The script will generate the sequence for video with the following formats.
<img src='https://drive.google.com/uc?id=1QShiyVZWZUt8R_GwH1oAz0gB-fqS4lEh'>
Here, `.qt` file the uploaded file and rest of the file are different renditions generated for streaming over HTTP. Now, we do not need original file. We just have to upload the Renditions alon with `.m3u8` playlist files.

### Triggering the webhook for upload to S3
Now in the last step, We will upload all generated renditions to S3. We don't have to upload original file but we can for the backup purpose. Now, the single file `playlist.m3u8` will be sufficient to stream the video on any supporting device that support HLS streaming. The most common example are VLC media Player, WMV player, Android player, HTML5 Web player etc.


## TODO
1. Messaging between shell and backend via `netcat` UDP connections.
2. Alerts and Upload status management.
3. Dynamic Renditions based on original video resolutions.
4. Dynamic segment size, bitrateratio and buffer ratio.
5. Advanced logging and log tracking.
6. Advanced error handling and fault taulrance.
7. Handling for production scaling with load balance test.

## Support and Help
Reach out ot me at sharma02gaurav@gmail.com

PRs are welcome.

## References
- [Netcat Cheatsheet](https://www.sans.org/security-resources/sec560/netcat_cheat_sheet_v1.pdf)
- [ffmpeg](https://www.ffmpeg.org/)
- [HLS HTTP Live Streaming](https://en.wikipedia.org/wiki/HTTP_Live_Streaming)
- [Official Documentation by Apple for HLS](https://developer.apple.com/documentation/http_live_streaming/example_playlists_for_http_live_streaming)
- [Reference for Live video Transmuxing and Transcoding](https://blog.twitch.tv/en/2017/10/10/live-video-transmuxing-transcoding-f-fmpeg-vs-twitch-transcoder-part-i-489c1c125f28/)
- [Guide for iOS and Android](https://mux.com/blog/mobile-hls-guide/)
- [Sample m3u8 playlists](https://g33ktricks.blogspot.com/2016/04/list-of-hls-streaming-video-sample-test.html)
- [Serving video at scale](https://www-sjc.egnyte.com/blog/2018/12/transcoding-how-we-serve-videos-at-scale/)
