// This component downloads an image from S3 and displays it in the browser.
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { useEffect, useState } from "react";

interface AutoDownloadImageProps {
  imageKey: string;
}

const AutoDownloadImage: React.FC<AutoDownloadImageProps> = ({ imageKey }) => {
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchImage = async () => {
      const s3 = new S3Client({
        region: process.env.NEXT_PUBLIC_AWS_REGION,
      });

      const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || '',
        Key: imageKey,
      };

      try {
        const command = new GetObjectCommand(params);
        const { Body } = await s3.send(command);

        if (Body instanceof ReadableStream) {
          const reader = Body.getReader();
          const chunks: Uint8Array[] = [];

          const processText = async (): Promise<void> => {
            const { done, value } = await reader.read();
            if (done) {
              const blob = new Blob(chunks); // Combine all chunks into a blob
              const url = window.URL.createObjectURL(blob);
              setImageUrl(url);
              return;
            }
            if (value) {
              chunks.push(value);
            }
            return processText(); // Recursively read the next chunk
          };

          processText();
        } else {
          console.error('No data returned from S3 or the Body is not a ReadableStream');
        }
      } catch (err) {
        console.error('Error fetching image from S3:', err);
      }
    };

    fetchImage();
  }, [imageKey]);

  return (
    <img src={imageUrl} alt="Downloaded from S3" style={{ aspectRatio: '0.773' }} className="w-full object-cover" />
  );
};

export default AutoDownloadImage;
