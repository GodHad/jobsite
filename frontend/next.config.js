const path = require('path');

module.exports = {
    reactStrictMode: true,
    swcMinify: true, // For minifying JavaScript with SWC
    // Optional: For handling Sass files
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
}