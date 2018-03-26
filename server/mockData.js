const cardList = [
  {'id': 0, 'title': 'activity-0', 'type': 'activity', 'order': 0},
  {'id': 1, 'title': 'activity-1', 'type': 'activity', 'order': 1},
  {'id': 2, 'title': 'activity-2', 'type': 'activity', 'order': 2},
  {'id': 6, 'title': 'task-6', 'type': 'task', 'parentId': 0, 'order': 0},
  {'id': 9, 'title': 'task-9', 'type': 'task', 'parentId': 0, 'order': 1},
  {'id': 3, 'title': 'task-3', 'type': 'task', 'parentId': 0, 'order': 2},
  {'id': 12, 'title': 'subtask-12', 'type': 'subtask', 'grandParentId': 0, 'parentId': 6, 'releaseId': 3, 'order': 0, 'labelId': 0},
  {'id': 18, 'title': 'subtask-18', 'type': 'subtask', 'grandParentId': 0, 'parentId': 9, 'releaseId': 3, 'order': 0, 'labelId': 1},
  {'id': 24, 'title': 'subtask-24', 'type': 'subtask', 'grandParentId': 0, 'parentId': 3, 'releaseId': 3, 'order': 0, 'labelId': 0},
  {'id': 21, 'title': 'subtask-21', 'type': 'subtask', 'grandParentId': 0, 'parentId': 6, 'releaseId': 1, 'order': 0, 'labelId': 3},
  {'id': 15, 'title': 'subtask-15', 'type': 'subtask', 'grandParentId': 0, 'parentId': 9, 'releaseId': 1, 'order': 0, 'labelId': 2},
  {'id': 27, 'title': 'subtask-27', 'type': 'subtask', 'grandParentId': 0, 'parentId': 9, 'releaseId': 1, 'order': 1, 'labelId': 2},
  {'id': 4, 'title': 'task-4', 'type': 'task', 'parentId': 1, 'order': 0},
  {'id': 7, 'title': 'task-7', 'type': 'task', 'parentId': 1, 'order': 1},
  {'id': 25, 'title': 'subtask-25', 'type': 'subtask', 'grandParentId': 1, 'parentId': 7, 'releaseId': 3, 'order': 0, 'labelId': 3},
  {'id': 16, 'title': 'subtask-16', 'type': 'subtask', 'grandParentId': 1, 'parentId': 4, 'releaseId': 3, 'order': 0, 'labelId': 0},
  {'id': 10, 'title': 'subtask-10', 'type': 'subtask', 'grandParentId': 1, 'parentId': 4, 'releaseId': 3, 'order': 1, 'labelId': 1},
  {'id': 13, 'title': 'subtask-13', 'type': 'subtask', 'grandParentId': 1, 'parentId': 7, 'releaseId': 1, 'order': 0, 'labelId': 3},
  {'id': 19, 'title': 'subtask-19', 'type': 'subtask', 'grandParentId': 1, 'parentId': 7, 'releaseId': 1, 'order': 1, 'labelId': 2},
  {'id': 30, 'title': 'subtask-30', 'type': 'subtask', 'grandParentId': 1, 'parentId': 7, 'releaseId': 1, 'order': 2, 'labelId': 2},
  {'id': 31, 'title': 'subtask-31', 'type': 'subtask', 'grandParentId': 1, 'parentId': 7, 'releaseId': 1, 'order': 3, 'labelId': 1},
  {'id': 22, 'title': 'subtask-22', 'type': 'subtask', 'grandParentId': 1, 'parentId': 4, 'releaseId': 1, 'order': 0, 'labelId': 1},
  {'id': 28, 'title': 'subtask-28', 'type': 'subtask', 'grandParentId': 1, 'parentId': 4, 'releaseId': 2, 'order': 0, 'labelId': 0},
  {'id': 8, 'title': 'task-8', 'type': 'task', 'parentId': 2, 'order': 0},
  {'id': 5, 'title': 'task-5', 'type': 'task', 'parentId': 2, 'order': 1},
  // {'id': 20, 'title': 'subtask-20', 'type': 'subtask', 'grandParentId': 2, 'parentId': 8, 'releaseId': 3, 'order': 0, 'labelId': 0},
  // {'id': 14, 'title': 'subtask-14', 'type': 'subtask', 'grandParentId': 2, 'parentId': 8, 'releaseId': 1, 'order': 0, 'labelId': 1},
  // {'id': 26, 'title': 'subtask-26', 'type': 'subtask', 'grandParentId': 2, 'parentId': 8, 'releaseId': 2, 'order': 0, 'labelId': 1},
  {'id': 29, 'title': 'subtask-29', 'type': 'subtask', 'grandParentId': 2, 'parentId': 5, 'releaseId': 3, 'order': 0, 'labelId': 3},
  {'id': 23, 'title': 'subtask-23', 'type': 'subtask', 'grandParentId': 2, 'parentId': 5, 'releaseId': 1, 'order': 0, 'labelId': 2},
  {'id': 17, 'title': 'subtask-17', 'type': 'subtask', 'grandParentId': 2, 'parentId': 5, 'releaseId': 2, 'order': 0, 'labelId': 3},
  {'id': 11, 'title': 'subtask-11', 'type': 'subtask', 'grandParentId': 2, 'parentId': 5, 'releaseId': 2, 'order': 1, 'labelId': 2}
];

const releaseList = [
  {'id': 3, 'title': 'release-0', 'order': 0},
  {'id': 1, 'title': 'release-1', order: 2},
  {'id': 2, 'title': 'release-2', order: 1}
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
