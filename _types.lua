---@meta

---@class ProgressTracker_HintConfig
---@field primaryColor? string
---@field position? string
---@field colorScheme 'light' | 'dark' | 'auto'
---@field hideKey string
---@field hideCommand string

---@class ProgressTracker_HintHeader
---@field title string
---@field description string
---@field icon? string

---@class ProgressTracker_HintAction
---@field key string
---@field text string

---@class ProgressTracker_HintProgress
---@field title string
---@field max number
---@field progress number

---@class ProgressTracker_HintExtra
---@field title string
---@field description string
---@field icon string

---@class ProgressTracker_Hint
---@field header ProgressTracker_HintHeader
---@field action ProgressTracker_HintAction
---@field progress ProgressTracker_HintProgress
---@field extra ProgressTracker_HintExtra[]
---@field resource string

---@param id string
---@param data ProgressTracker_Hint
function exports.progress_tracker:registerHint(id, data) end

---@param id string
---@param data ProgressTracker_HintHeader
function exports.progress_tracker:setHeader(id, data) end

---@param id string
---@param data ProgressTracker_HintAction
function exports.progress_tracker:setAction(id, data) end

---@param id string
---@param data ProgressTracker_HintProgress
function exports.progress_tracker:setProgress(id, data) end

---@param id string
---@param data ProgressTracker_HintExtra[]
function exports.progress_tracker:setExtra(id, data) end

---@param id string
function exports.progress_tracker:setActive(id) end
