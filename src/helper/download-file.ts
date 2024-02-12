export function downloadFile(name: string, path: string) {
    const link = document.createElement('a');
    link.href = path;
    link.download = name;
    link.click();
}
