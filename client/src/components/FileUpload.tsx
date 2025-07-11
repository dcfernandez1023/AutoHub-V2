import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

type BaseImageProps = {
  accept: 'image/*';
  base64Preview?: string | null;
  label: string;
  handleChooseFile: (file: File) => void;
};

type GenericFileProps = {
  accept: string;
  label: string;
  handleChooseFile: (file: File) => void;
};

type ImageUploadProps = BaseImageProps | GenericFileProps;

const ImageUpload: React.FC<ImageUploadProps> = (props) => {
  const [imagePreview, setImagePreview] = useState<string>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      props.handleChooseFile(file);
    }
  };

  useEffect(() => {
    if (props.accept === 'image/*') {
      const imageProps = props as BaseImageProps;
      if (imageProps.base64Preview) {
        setImagePreview(imageProps.base64Preview);
      }
    }
  }, [props]);

  return (
    <Form>
      <Form.Group controlId="formFile">
        <Form.Label>{props.label}</Form.Label>
        <Form.Control
          type="file"
          accept={props.accept}
          onChange={handleFileChange}
        />
      </Form.Group>

      {props.accept === 'image/*' && imagePreview && (
        <div style={{ marginTop: '1rem' }}>
          <p>Preview:</p>
          <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </Form>
  );
};

export default ImageUpload;
