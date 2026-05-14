const successMsg = [{ msgCode: 'success', msgText: 'success' }];

const nowTaskId = () => `task_${Date.now()}`;

const ok = (res, resData = {}, extra = {}) => res.json({
  ...extra,
  code: 200,
  resCode: 1,
  data: { resData },
  resData,
  resMsg: successMsg
});

const notStarted = {
  progress: 0,
  status: 'idle'
};

const emptyPage = {
  rows: [],
  total: 0
};

const getSize = (newSize) => {
  if (typeof newSize !== 'string') {
    return { width: 1920, height: 1080 };
  }
  const [width, height] = newSize.split(/[x*]/).map((item) => Number(item.trim()));
  return {
    width: Number.isFinite(width) ? width : 1920,
    height: Number.isFinite(height) ? height : 1080
  };
};

const asyncHandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (error) {
    next(error);
  }
};

exports.getPaintingStyle = asyncHandler(async (req, res) => ok(res, [
  { name: '写实', value: 'realistic', url: '' },
  { name: '电影感', value: 'cinematic', url: '' },
  { name: '国风', value: 'chinese-style', url: '' }
]));

exports.getBackgroundMusicList = asyncHandler(async (req, res) => ok(res, []));

exports.setProjectBackgroundMusic = asyncHandler(async (req, res) => ok(res));

exports.getMtk = asyncHandler(async (req, res) => ok(res, {
  password: 'example-password',
  account: 'example-account',
  mtk: '1111example-mtk'
}));

exports.setMtk = asyncHandler(async (req, res) => ok(res));

exports.fileParse = asyncHandler(async (req, res) => ok(res, {
  fileContent: ''
}));

exports.uploadExampleImage = asyncHandler(async (req, res) => ok(res, {
  imageUrl: ''
}));

exports.deleteExampleImage = asyncHandler(async (req, res) => ok(res));

exports.createProject = asyncHandler(async (req, res) => {
  const taskId = nowTaskId();
  return ok(res, { taskId }, { taskId });
});

exports.getProjectDetail = asyncHandler(async (req, res) => {
  const { taskId, indexes, newSize } = req.body || {};
  const size = getSize(newSize);
  const storyboards = Array.isArray(indexes)
    ? indexes.map((index) => ({
      index,
      source: '',
      prompt: '',
      materials: []
    }))
    : [];

  return ok(res, {
    taskId: taskId || '',
    stage: 0,
    title: '未命名项目',
    type: '',
    width: size.width,
    height: size.height,
    fileName: '',
    fileSize: 0,
    repaintingCount: 1,
    textList: storyboards
  }, {
    stage: 0,
    title: '未命名项目',
    type: '',
    width: size.width,
    height: size.height,
    fileName: '',
    fileSize: 0,
    repaintingCount: 1
  });
});

exports.contentExtract = asyncHandler(async (req, res) => ok(res, {
  content: '',
  textList: []
}));

exports.editRepaintingCount = asyncHandler(async (req, res) => ok(res));

exports.setFileContent = asyncHandler(async (req, res) => ok(res));

exports.getProjectList = asyncHandler(async (req, res) => ok(res, emptyPage.rows, {
  total: emptyPage.total
}));

exports.analyzeScence = asyncHandler(async (req, res) => ok(res, {
  labels: [],
  prompt: {}
}));

exports.analyzeAndGenimage = asyncHandler(async (req, res) => ok(res, {
  taskId: req.body?.taskId || nowTaskId()
}));

exports.stopTaskAnalyzeAndGenimage = asyncHandler(async (req, res) => ok(res));

exports.getAnalyzeAndGenimageProgress = asyncHandler(async (req, res) => ok(res, notStarted));

exports.getVoiceList = asyncHandler(async (req, res) => ok(res, []));

exports.generateAudio = asyncHandler(async (req, res) => ok(res, {
  audioUrl: '',
  subtitles: []
}));

exports.generateImage = asyncHandler(async (req, res) => ok(res, {
  imageList: []
}));

exports.getPicByIndexes = asyncHandler(async (req, res) => ok(res, []));

exports.makeVideo = asyncHandler(async (req, res) => ok(res, {
  videoPath: ''
}));

exports.saveStoryboardAudio = asyncHandler(async (req, res) => ok(res, {
  audioUrl: ''
}));

exports.exportJianyingDraft = asyncHandler(async (req, res) => ok(res));

exports.copyVideo = asyncHandler(async (req, res) => ok(res));

exports.getMakeVideoProgress = asyncHandler(async (req, res) => ok(res, {
  progress: 0
}, {
  progress: 0
}));

exports.getExportProgress = asyncHandler(async (req, res) => ok(res, {
  progress: 0
}, {
  progress: 0
}));

exports.seekVideo = asyncHandler(async (req, res) => ok(res, {
  videoUrl: ''
}, {
  videoUrl: ''
}));

exports.getAnscenceProcess = asyncHandler(async (req, res) => ok(res, notStarted));

exports.getGenImageProcess = asyncHandler(async (req, res) => ok(res, notStarted));

exports.deleteMediumShooting = asyncHandler(async (req, res) => ok(res));

exports.addMediumShooting = asyncHandler(async (req, res) => ok(res));

exports.deleteProject = asyncHandler(async (req, res) => ok(res));

exports.deleteVideo = asyncHandler(async (req, res) => ok(res));

exports.deleteJianyingDraft = asyncHandler(async (req, res) => ok(res));

exports.editProjectBasicInformation = asyncHandler(async (req, res) => ok(res));

exports.getLabel = asyncHandler(async (req, res) => ok(res, []));

exports.searchLabel = asyncHandler(async (req, res) => ok(res, []));

exports.translators = asyncHandler(async (req, res) => ok(res, {
  TargetText: req.body?.text || ''
}));

exports.setLabel = asyncHandler(async (req, res) => ok(res));

exports.delLabel = asyncHandler(async (req, res) => ok(res));

exports.getDefaultPrompt = asyncHandler(async (req, res) => ok(res, {
  prompt: '',
  negativePrompt: ''
}));

exports.generateLabelImage = asyncHandler(async (req, res) => ok(res, {
  taskId: req.body?.taskId || nowTaskId()
}));

exports.findLabelImage = asyncHandler(async (req, res) => ok(res, [
  { imageBase64: '' }
]));

exports.getCloudModelList = asyncHandler(async (req, res) => ok(res, []));

exports.getSdConfig = asyncHandler(async (req, res) => ok(res, {
  sd_url: '',
  username: '',
  password: '',
  current_model: '',
  current_vae: '',
  sampler_name: 'Euler',
  scheduler: '',
  steps: 20,
  cfg_scale: 7,
  seed: -1,
  n_iter: 1,
  available_models: [],
  available_vaes: [],
  available_samplers: [],
  available_schedulers: [],
  state: false
}));

exports.getTranslateConfig = asyncHandler(async (req, res) => ok(res, {
  appId: '',
  secret: ''
}));

exports.saveTranslateSecret = asyncHandler(async (req, res) => ok(res));

exports.getShootingPath = asyncHandler(async (req, res) => ok(res, {
  path: ''
}, {
  path: ''
}));

exports.getJianyingConfig = asyncHandler(async (req, res) => ok(res, {
  jianying: '',
  jianyingDraftPath: ''
}));

exports.saveJianyingAddress = asyncHandler(async (req, res) => ok(res));

exports.setSdConfig = asyncHandler(async (req, res) => ok(res));

exports.changeLocalSdApiState = asyncHandler(async (req, res) => ok(res));

exports.getVideoList = asyncHandler(async (req, res) => ok(res, emptyPage.rows, {
  total: emptyPage.total
}));

exports.extractRoleLabels = asyncHandler(async (req, res) => ok(res, []));

exports.stopAnalyzeScence = asyncHandler(async (req, res) => ok(res));

exports.stopGenerateImage = asyncHandler(async (req, res) => ok(res));

exports.openFolder = asyncHandler(async (req, res) => ok(res));

exports.saveLabelImage = asyncHandler(async (req, res) => ok(res, {
  imageList: [
    { imageUrl: '' }
  ]
}));

exports.saveStoryboardImage = asyncHandler(async (req, res) => ok(res, {
  materials: [
    { mIndex: 0 }
  ]
}));

exports.saveStoryboardVideo = asyncHandler(async (req, res) => ok(res, {
  materials: {
    mIndex: 0
  }
}));

exports.getPaintingApiState = asyncHandler(async (req, res) => ok(res, {
  imageModel: false,
  videoModel: false
}));

exports.connectSd = asyncHandler(async (req, res) => ok(res));

exports.setCloudModel = asyncHandler(async (req, res) => ok(res));

exports.generateSdImageSynchronous = asyncHandler(async (req, res) => ok(res, {
  imageData: []
}));

exports.updater = asyncHandler(async (req, res) => ok(res));

exports.updaterCheck = asyncHandler(async (req, res) => ok(res));

exports.checkUpdateProgress = asyncHandler(async (req, res) => ok(res, {
  progress: 0
}));
