function sortList (list) {
  const _list = [];

  if (list.length) {
    const firstItem = list.find(item => !('prevId' in item));
    _list.push(firstItem);

    while (_list.length < list.length) {
      const lastId = _list[_list.length - 1].id;

      list.forEach(item => {
        if (item.prevId === lastId) {
          _list.push(item);
        }
      });
    }
  }
  return _list;
}

function lowerFirstChar (word) {
  return word.charAt(0).toLowerCase() + word.slice(1);
}

module.exports = {
  sortList,
  lowerFirstChar
};
