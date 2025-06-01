import NextImage from 'next/image';
import { ComponentProps, ReactEventHandler, useState } from 'react';
import { FALLBACK_IMAGE_URL } from '~/constants';

type ImageProps = ComponentProps<typeof NextImage>;
type ImageSrcProp = ImageProps['src'] | undefined;

export default function Image({ src, onError, ...props }: ImageProps & { src: ImageSrcProp }) {
  const [error, setError] = useState<boolean>(false);
  const srcValue = src ?? FALLBACK_IMAGE_URL;

  const handleError: ReactEventHandler<HTMLImageElement> = (event) => {
    setError(true);
    onError?.(event);
  };

  return <NextImage src={error ? FALLBACK_IMAGE_URL : srcValue} {...props} onError={handleError} />;
}
