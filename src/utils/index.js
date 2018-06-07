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

function padZero (n) {
  return (n < 10) ? `0${n}` : n;
}

function timeFormatter (timestamp) {
  const time = new Date(timestamp);
  const year = time.getFullYear();
  const month = padZero(time.getMonth() + 1);
  const date = padZero(time.getDate());
  const hour = padZero(time.getHours());
  const minute = padZero(time.getMinutes());
  const second = padZero(time.getSeconds());

  return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
}

module.exports = {
  sortList,
  lowerFirstChar,
  timeFormatter
};
