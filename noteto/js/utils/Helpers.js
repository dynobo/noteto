const Helpers = {
/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} array to split
 * @param ChunkSize {Integer} Size of every group
 */
  chunkArray(myArray, ChunkSize) {
    let index = 0;
    const arrayLength = myArray.length;
    const tempArray = [];

    for (index = 0; index < arrayLength; index += ChunkSize) {
      const myChunk = myArray.slice(index, index + ChunkSize);
      // Do something if you want with the group
      tempArray.push(myChunk);
    }

    return tempArray;
  },
};
export default Helpers;
