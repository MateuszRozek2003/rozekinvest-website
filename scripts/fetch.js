export {};
async function main() {
    const res = await fetch('https://www.silvercoastpropertyservices.com/en/accommodation/nautilus-silvercoast/');
    const text = await res.text();
    const imgs = text.match(/https:\/\/[^"]+\.jpeg|https:\/\/[^"]+\.jpg/g);
    const unique = [...new Set(imgs)];
    console.log(unique.join('\n'));
}
main();
