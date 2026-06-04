const ftp = require("basic-ftp");
async function listFTP() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "serwer2274662.home.pl",
            user: "mateusz@rozek.pl",
            password: "Fundacj@2026!",
            secure: false
        });
        const list = await client.list();
        console.log("FTP Root contents:");
        console.table(list.map(i => ({ name: i.name, type: i.type })));
    } catch(err) {
        console.error(err);
    } finally {
        client.close();
    }
}
listFTP();
