$('#profilePhoto').on('load', () => {
    let image = document.getElementById('profilePhoto').src;
    let cropper = new Image();
    cropper.onload = () => {
        let width = cropper.naturalWidth;
        let height = cropper.naturalHeight;

        let aspectRatio = width / height;

        let croppedWidth = width;
        let croppedHeight = height;
        if (aspectRatio > 1) {
            croppedWidth = height;
        } else if (aspectRatio < 1) {
            croppedHeight = width;
        }

        let outputX = (croppedWidth - width) * 0.5;
        let outputY = (croppedHeight - height) * 0.5;

        let croppedImage = document.createElement('canvas');
        croppedImage.width = croppedWidth;
        croppedImage.height = croppedHeight;
        let context = croppedImage.getContext('2d');
        context.drawImage(cropper, outputX, outputY);
        document.getElementById('profilePhoto').src = croppedImage.toDataURL();
    };
    cropper.src = image;
});
