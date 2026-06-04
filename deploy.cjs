const ftp = require("basic-ftp");
const path = require("path");

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        console.log("Connecting to FTP...");
        await client.access({
            host: "serwer2274662.home.pl",
            user: "mateusz@rozek.pl",
            password: "Fundacj@2026!",
            secure: false
        });
        console.log("Connected to FTP! Uploading files...");
        await client.uploadFromDir(path.join(__dirname, "dist"));
        console.log("Upload complete!");
    } catch(err) {
        console.error("FTP Deployment Error:", err);
    } finally {
        client.close();
    }
}

deploy();
