async function handleDelete(path: string, deleteFile: (path: string) => void) {
  try {
    deleteFile(path);
  } catch(err) {
    console.error(err)
  }
}

export default handleDelete;