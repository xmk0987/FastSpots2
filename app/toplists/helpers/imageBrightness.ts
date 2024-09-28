export const getImageBrightness = async (
  imageUrl: string
): Promise<"light" | "dark"> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Allows cross-origin image fetching
    img.src = imageUrl;

    img.onload = () => {
      // Create a canvas and draw the image on it
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve("dark"); // Default to light if no context
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Get the pixel data from the canvas
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      let darkPixels = 0;
      let lightPixels = 0;

      // Loop through each pixel (R, G, B, A are stored sequentially)
      for (let x = 0; x < data.length; x += 4) {
        const r = data[x];
        const g = data[x + 1];
        const b = data[x + 2];

        // Calculate the brightness of the pixel (0 - 255)
        const brightness = Math.floor((r + g + b) / 3);

        // Threshold to classify the pixel as dark or light
        if (brightness < 50) {
          darkPixels++;
        } else {
          lightPixels++;
        }
      }

      // Determine if the majority of the pixels are dark or light
      if (darkPixels > lightPixels) {
        resolve("light"); // If the majority of pixels are dark, use the light theme
      } else {
        resolve("dark"); // If the majority of pixels are light, use the dark theme
      }
    };

    img.onerror = () => {
      resolve("dark"); // Fallback to light in case of an error
    };
  });
};
