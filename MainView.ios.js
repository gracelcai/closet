var ActivityView = require('react-native-activity-view');



ActivityView.show({
  text: "Text you want to share",
  url: "URL you want to share",
  imageUrl: "Url of the image you want to share/action",
  imageBase64: "Raw base64 encoded image data"
  image: "Name of the image in the app bundle",
  file: "Path to file you want to share",
  exclude: ['postToFlickr'],
  anchor: React.findNodeHandle(this.refs.share), // Where you want the share popup to point to on iPad
});
