---@type ProgressTracker_HintConfig
Config = {
    -- leave as nil if using convars
    primaryColor = nil,
    -- leave as nil if using convars
    position = nil,

    -- auto uses the wether its day or night to set the color scheme 
    colorScheme = 'auto',

    hideKey = 'E',

    hideCommand = 'SwitchHide'
}

RegisterCommand(Config.hideCommand, function()
    ToggleHint()
end, false)
RegisterKeyMapping(Config.hideCommand, 'Show/Hide the hint menu', 'keyboard', Config.hideKey)
