const cardList = [
  {'id': 25, 'title': 'subtask-25', 'type': 'subtask', 'grandparentId': 1, 'parentId': 7, 'releaseId': 3, 'labelId': 3},
  {'id': 16, 'title': 'subtask-16', 'type': 'subtask', 'grandparentId': 1, 'parentId': 4, 'releaseId': 3, 'labelId': 0},
  {'id': 10, 'title': 'subtask-10', 'type': 'subtask', 'grandparentId': 1, 'parentId': 4, 'releaseId': 3, 'labelId': 1, 'prevId': 16},

  {'id': 8, 'title': 'task-8', 'type': 'task', 'parentId': 2},
  {'id': 5, 'title': 'task-5', 'type': 'task', 'parentId': 2, 'prevId': 8},
  {'id': 0, 'title': 'activity-0', 'type': 'activity'},
  {'id': 1, 'title': 'activity-1', 'type': 'activity', 'prevId': 2},
  {'id': 2, 'title': 'activity-2', 'type': 'activity', 'prevId': 0},
  {'id': 6, 'title': 'task-6', 'type': 'task', 'parentId': 0},
  {'id': 9, 'title': 'task-9', 'type': 'task', 'parentId': 0, 'prevId': 6},
  {'id': 3, 'title': 'task-3', 'type': 'task', 'parentId': 0, 'prevId': 9},
  {'id': 12, 'title': 'subtask-12', 'type': 'subtask', 'grandparentId': 0, 'parentId': 6, 'releaseId': 3, 'labelId': 0},
  {'id': 18, 'title': 'subtask-18', 'type': 'subtask', 'grandparentId': 0, 'parentId': 9, 'releaseId': 3, 'labelId': 1},
  // {'id': 24, 'title': 'subtask-24', 'type': 'subtask', 'grandparentId': 0, 'parentId': 3, 'releaseId': 3, 'labelId': 0},
  {'id': 21, 'title': 'subtask-21', 'type': 'subtask', 'grandparentId': 0, 'parentId': 6, 'releaseId': 1, 'labelId': 3},
  {'id': 15, 'title': 'subtask-15', 'type': 'subtask', 'grandparentId': 0, 'parentId': 9, 'releaseId': 1, 'labelId': 2},
  {'id': 27, 'title': 'subtask-27', 'type': 'subtask', 'grandparentId': 0, 'parentId': 9, 'releaseId': 1, 'labelId': 2, 'prevId': 15},
  {'id': 4, 'title': 'task-4', 'type': 'task', 'parentId': 1},
  {'id': 7, 'title': 'task-7', 'type': 'task', 'parentId': 1, 'prevId': 4},

  {'id': 13, 'title': 'subtask-13', 'type': 'subtask', 'grandparentId': 1, 'parentId': 7, 'releaseId': 1, 'labelId': 3},
  {'id': 19, 'title': 'subtask-19', 'type': 'subtask', 'grandparentId': 1, 'parentId': 7, 'releaseId': 1, 'labelId': 2, 'prevId': 13},
  {'id': 30, 'title': 'subtask-30', 'type': 'subtask', 'grandparentId': 1, 'parentId': 7, 'releaseId': 1, 'labelId': 2, 'prevId': 19},
  {'id': 31, 'title': 'subtask-31', 'type': 'subtask', 'grandparentId': 1, 'parentId': 7, 'releaseId': 1, 'labelId': 1, 'prevId': 30},
  {'id': 22, 'title': 'subtask-22', 'type': 'subtask', 'grandparentId': 1, 'parentId': 4, 'releaseId': 1, 'labelId': 1},
  {'id': 28, 'title': 'subtask-28', 'type': 'subtask', 'grandparentId': 1, 'parentId': 4, 'releaseId': 2, 'labelId': 0},
  {'id': 20, 'title': 'subtask-20', 'type': 'subtask', 'grandparentId': 2, 'parentId': 8, 'releaseId': 3, 'labelId': 0},
  {'id': 14, 'title': 'subtask-14', 'type': 'subtask', 'grandparentId': 2, 'parentId': 8, 'releaseId': 1, 'labelId': 1},
  {'id': 26, 'title': 'subtask-26', 'type': 'subtask', 'grandparentId': 2, 'parentId': 8, 'releaseId': 2, 'labelId': 1},
  {'id': 29, 'title': 'subtask-29', 'type': 'subtask', 'grandparentId': 2, 'parentId': 5, 'releaseId': 3, 'labelId': 3},
  {'id': 23, 'title': 'subtask-23', 'type': 'subtask', 'grandparentId': 2, 'parentId': 5, 'releaseId': 1, 'labelId': 2},
  {'id': 17, 'title': 'subtask-17', 'type': 'subtask', 'grandparentId': 2, 'parentId': 5, 'releaseId': 2, 'labelId': 3},
  {'id': 11, 'title': 'subtask-11', 'type': 'subtask', 'grandparentId': 2, 'parentId': 5, 'releaseId': 2, 'labelId': 2, 'prevId': 17}
];

const releaseList = [
  {'id': 3, 'title': 'release-3'},
  {'id': 1, 'title': 'release-1', prevId: 3},
  {'id': 2, 'title': 'release-2', prevId: 1}
];

const defaultRelease = [{
  id: 0,
  title: 'card',
  order: 0
}];

module.exports = {
  cardList,
  releaseList,
  defaultRelease
};
