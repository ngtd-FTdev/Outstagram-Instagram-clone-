import cloudinary from "./cloudinary";
import getDataUri from "./datauri";

export const processAndUploadMedia = async ({ arrayFiles, bodyPost }) => {
  return await Promise.all(
    arrayFiles.map(async (obj) => {
      const parts = obj?.fieldname?.split("_");
      const index = parseInt(parts[parts.length - 1], 10);

      let media = {};
      const dataUri = getDataUri(obj);
      const transformations = [];

      if (bodyPost?.mediaMetadata[index]?.edit?.Trim) {
        const trim = bodyPost.mediaMetadata[index].edit.Trim;
        transformations.push({
          start_offset: trim.startTime,
          end_offset: trim.endTime,
        });
      }

      if (bodyPost?.mediaMetadata[index]?.cropSettings?.croppedAreaPixels) {
        const { x, y, width, height } =
          bodyPost.mediaMetadata[index].cropSettings.croppedAreaPixels;
        transformations.push({
          crop: "crop",
          x,
          y,
          width,
          height,
        });
      }

      const file = await cloudinary.uploader.upload(dataUri, {
        folder: "instagram/img_video_post",
        resource_type: "auto",
        transformation: transformations,
      });

      media.url_media = file.secure_url;

      if (bodyPost?.mediaMetadata[index]?.thumbnail) {
        const thumbUpload = await cloudinary.uploader.upload(
          bodyPost?.mediaMetadata[index]?.thumbnail,
          {
            folder: "instagram/img_video_post",
            resource_type: "auto",
            transformation: transformations[transformations.length - 1],
          }
        );
        media.thumbnail = thumbUpload.secure_url;
      }

      if (file.resource_type === "video") {
        media.type = "video";
      }

      return media;
    })
  );
};
