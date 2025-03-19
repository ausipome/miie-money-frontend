import AWS from 'aws-sdk';
import { useEffect } from 'react';
import { Book } from "@/types";

interface AutoDownloadImageProps {
  book: Book;
}

const AutoDownloadImage: React.FC<AutoDownloadImageProps> = ({ book }) => {
  useEffect(() => {
    const downloadImage = async () => {
      try {
        const s3 = new AWS.S3({
            region: process.env.NEXT_PUBLIC_AWS_REGION,
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || 'your-access-key-id',
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || 'your-secret-access-key',
            // Other AWS configuration might be necessary depending on your setup
          });

        const params = {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || '',
          Key: book.download,
        };

        const data = await s3.getObject(params).promise();

        if (data.Body) {
          const url = window.URL.createObjectURL(new Blob([data.Body as Buffer]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', params.Key.split('/').pop() || 'default_filename'); // Use the file name from the key as the download name
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          console.error('No data returned from S3');
          alert('Download failed. Please try again later.');
        }
      } catch (err) {
        console.error(err);
        alert('Download failed. Please try again later.');
      }
    };

    if (book && book.download) {
      downloadImage();
    }
  }, [book]); // Dependency array includes book to react to changes

  // This component can still show the image if needed
  return (
    <img src={book.image} alt={book.title} style={{ aspectRatio: '0.773' }} className="w-full object-cover" />
  );
};

export default AutoDownloadImage;
