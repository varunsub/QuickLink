
/* eslint valid-jsdoc: "error"*/
/* eslint-env es6*/
/**
 * Takes the aws url and gets the shortlink then updates the HTML content
 * @param {string} url passes in aws url
 * @returns {string} url passes in aws url
 */
function shortifyURL(url) {
  const xhrSignedRequest = new XMLHttpRequest();
  // sends get request for the shortlink
  xhrSignedRequest.open('GET', `/getfile?url=${url}`);
  xhrSignedRequest.onreadystatechange = () => {
    if (xhrSignedRequest.readyState === 4) {
      if (xhrSignedRequest.status === 200) {
      // console.log(xhrSignedRequest.responseText) <Use for debugging>
      // makes preview visible
        document.getElementById('preview').style.display = 'block';
        // hides preview box
        document.getElementById('file-input').style.display = 'none';
        document.getElementById('customlabel').style.display = 'none';
        // updates text and link
        document.getElementById('urlbox').innerText=xhrSignedRequest.responseText;
        document.getElementById('urlbox').href = xhrSignedRequest.responseText;
      } else {
        alert(`Error: ${xhrSignedRequest.status} ${xhrSignedRequest.message}`);
      }
    }
  };
  xhrSignedRequest.send();
}

/**
 * Pushes file to s3 bucket and updates HTML preview image
 * @param {string} file file to upload to s3
 * @param {string} signedRequest signed url to upload to aws
 * @param {string} url passes in aws url
 * @returns {none} calls shortify function
 */
function s3UploadFile(file, signedRequest, url) {
  const xhrS3 = new XMLHttpRequest();
  // sends put request to upload file from passed signed url
  xhrS3.open('PUT', signedRequest);
  // after the file has been uploaded, the image preview is updated
  // the shortify function is called
  xhrS3.onreadystatechange = () => {
    if (xhrS3.readyState === 4) {
      if (xhrS3.status === 200) {
        shortifyURL(url);
        document.getElementById('preview').src = url;
        document.getElementById('avatar-url').value = url;
      } else {
        alert('Could not upload file.');
      }
    }
  };
  // sends request
  xhrS3.send(file);
}
/**
 *Requests signedurl to upload file from server
 * @param {string} file file to upload to s3
 * @returns {none} calls s3UploadFile function
 */
function getSignedRequest(file) {
  // sends get request with file name and type
  const xhrSignedRequest = new XMLHttpRequest();
  const endpoint = `/sign-s3?file-name=${file.name}&file-type=${file.type}`;
  xhrSignedRequest.open('GET', endpoint);
  // when response has been recieved, parse the response
  // and then calls s3Upload function
  xhrSignedRequest.onreadystatechange = () => {
    if (xhrSignedRequest.readyState === 4) {
      if (xhrSignedRequest.status === 200) {
        const response = JSON.parse(xhrSignedRequest.responseText);
        s3UploadFile(file, response.signedRequest, response.url);
      } else {
        alert('Could not get signed URL.');
      }
    }
  };
  // sends request to server
  xhrSignedRequest.send();
}
/**
 * Called after listener detects file has been uploaded
 * @returns {none} calls getSignedRequest function
 */
function initUpload() {
  // updates text to say url is generated
  document.getElementById('urlbox').innerText = 'your url is being generated';
  // ensure upload meets specifications
  const files = document.getElementById('file-input').files;
  const file = files[0];
  if (file == null) {
    return alert('No file selected.');
  }
  // calls function to recieve signed request
  console.log('reached');
  getSignedRequest(file);
}

/**
 * Listener is called when page is opened
 * @returns {none} calls initUpload when the file has been detected
 */
window.onload = function() {
  // when file has been uploaded, calls initUpload function
  document.getElementById('file-input').onchange = initUpload;
}();
