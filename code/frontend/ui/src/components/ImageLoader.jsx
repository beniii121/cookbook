import { useEffect, useState } from 'react';

/**
 * 
 * ImageLoader component for the CookBook frontend
 * 
 * This comopenent serves a very important function - it loads images, that are locally found or served over http.
 * Most of the images are accessed from the backend with their respective image path. If an image isn't found,
 * a default, "image not found" placeholder image will be shown.
 */

function ImageLoader(props) {
    const imageUrl = props.imageUrl;
    const className = props.className;
    const [imageSrc, setImageSrc] = useState();

    useEffect(() => {
        async function loadImage() {
            try {
                if (imageUrl.includes("http")) {
                    setImageSrc(imageUrl);
                } else {
                    const image = await import(imageUrl);
                    setImageSrc(image.default);
                }
            } catch (err) {
                setError('Image not found');
            }
        }

        loadImage();
    }, [imageUrl]);

    return(
        <img className={className} src={imageSrc} onError={() => setImageSrc("../../public/not_found.jpg")}/>
    );
}

export default ImageLoader;