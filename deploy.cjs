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
        console.log("Connected to FTP!");

        // Remove old files to avoid conflicts
        try {
            console.log("Emptying the remote root directory (cleaning old files)...");
            await client.cd("/");
            const list = await client.list();
            for (const item of list) {
                if (item.isDirectory) {
                    await client.removeDir(item.name);
                } else {
                    await client.remove(item.name);
                }
            }
        } catch (e) {
            console.log("Error cleaning old files:", e.message);
        }

        console.log("Uploading files from dist...");
        await client.cd("/");
        // uploadFromDir in basic-ftp DOES upload recursively, but to be safe let's upload the root and then explicitly assets
        await client.uploadFromDir(path.join(__dirname, "dist"));
        
        console.log("Ensuring assets folder is completely uploaded...");
        await client.ensureDir("assets");
        await client.uploadFromDir(path.join(__dirname, "dist", "assets"));

        // Let's verify assets
        await client.cd("/assets");
        const assetsList = await client.list();
        console.log("Uploaded assets:", assetsList.map(f => f.name));

        console.log("Upload complete!");
    } catch(err) {
        console.error("FTP Deployment Error:", err);
    } finally {
        client.close();
    }
}

deploy();

