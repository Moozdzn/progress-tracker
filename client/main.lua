local config = Config
---@type table<string, ProgressTracker_Hint>
local Hints = {}
local ActiveHint = nil

local function translateKey(command)
    command = type(command) == 'string' and joaat(command) or command
    local key = GetControlInstructionalButton(2, command | 0x80000000, true)
    if (string.find(key, 't_')) then
        return string.gsub(key, 't_', ''):lower()
    else
        local SpecialkeyCodes = {
            b_1015 = 'AltLeft',
            b_1000 = 'ShiftLeft',
            b_2000 = 'Space',
            b_1013 = 'ControlLeft',
            b_1002 = 'Tab',
            b_1014 = 'ControlRight',
            b_140 = 'Numpad4',
            b_142 = 'Numpad6',
            b_144 = 'Numpad8',
            b_141 = 'Numpad5',
            b_143 = 'Numpad7',
            b_145 = 'Numpad9',
            b_200 = 'Insert',
            b_1012 = 'CapsLock',
            b_170 = 'F1',
            b_171 = 'F2',
            b_172 = 'F3',
            b_173 = 'F4',
            b_174 = 'F5',
            b_175 = 'F6',
            b_176 = 'F7',
            b_177 = 'F8',
            b_178 = 'F9',
            b_179 = 'F10',
            b_180 = 'F11',
            b_181 = 'F12',
            b_194 = 'ArrowUp',
            b_195 = 'ArrowDown',
            b_196 = 'ArrowLeft',
            b_197 = 'ArrowRight',
            b_1003 = 'Enter',
            b_1004 = 'Backspace',
            b_198 = 'Delete',
            b_199 = 'Escape',
            b_1009 = 'PageUp',
            b_1010 = 'PageDown',
            b_1008 = 'Home',
            b_131 = 'NumpadAdd',
            b_130 = 'NumpadSubstract',
            b_211 = 'Insert',
            b_210 = 'Delete',
            b_212 = 'End',
            b_1055 = 'Home',
            b_1056 = 'PageUp',
        }
        return SpecialkeyCodes[key]
    end
end

local function sendReactMessage(action, data)
    SendNUIMessage({
        action = action,
        data = data
    })
end

function ToggleHint()
    if not ActiveHint then return end
    sendReactMessage('toggle', translateKey(config.hideCommand))
end

config.colorScheme = (config.colorScheme == 'light' or config.colorScheme == 'dark' or config.colorScheme == 'auto') and config.colorScheme or 'auto'

RegisterNUICallback('uiLoaded', function(_, cb)
    if not config.colorScheme then
        config.colorScheme = 'dark'
    end

    cb({
        color = config.primaryColor or GetConvar('progress_tracker:primaryColor', 'blue'),
        position = config.position or GetConvar('progress_tracker:position', 'right'),
        colorScheme = config.colorScheme
    })
end)

local function isCommand(key)
    local commands = GetRegisteredCommands()

    for i = 1, #commands do
        if commands[i].name == key then
            return true
        end
    end
end

local function asType(value, required, fn)
    return type(value) == required and value or fn(value)
end

local function asString(value)
    return asType(value, 'string', tostring)
end

local function asNumber(value)
    return asType(value, 'number', tonumber)
end

exports('registerHint', function(id, data)
    local hintData = {
        extra = {}
    }

    if not data or type(data) ~= "table" then return end

    if data.header then
        hintData.header = {
            title = asString(data.header.title),
            description = data.header.description and asString(data.header.description) or nil,
            icon = data.header.icon and asString(data.header.icon) or nil
        }
    end

    if data.action then
        hintData.action = {
            key = isCommand(data.action.key) and translateKey(data.action.key) or data.action.key,
            text = data.action.text and asString(data.action.text) or nil
        }
    end

    if data.progress then
        hintData.progress = {
            title = data.progress.title and asString(data.progress.title) or nil,
            max = asNumber(data.progress.max),
            progress = asNumber(data.progress.progress)
        }
    end

    if data.extra and #data.extra > 0 then
        for i = 1, 2 do
            if data.extra[i] then
                hintData.extra[#hintData.extra + 1] = {
                    title = asString(data.extra[i].title),
                    description = asString(data.extra[i].description),
                    icon = data.extra[i].icon and asString(data.extra[i].icon) or nil
                }
            end
        end
    end

    id = asType(id, 'string', tostring)
    hintData.resource = GetInvokingResource()

    Hints[id] = hintData
end)

exports('setActive', function(id)
    if not id or not Hints[id] then return end

    if not ActiveHint and config.colorScheme == 'auto' then
        CreateThread(function()
            local isNight = GetClockHours() >= 20 or GetClockHours() <= 6
            sendReactMessage('setTheme', isNight and 'dark' or 'light')

            while ActiveHint do
                Wait(500)

                local hour = GetClockHours()

                if (hour >= 20 or hour <= 6) and not isNight then
                    isNight = true
                    sendReactMessage('setTheme', 'dark')
                elseif (hour < 20 and hour > 6) and isNight then
                    isNight = false
                    sendReactMessage('setTheme', 'light')
                end
            end
        end)
    end

    ActiveHint = id

    sendReactMessage('show', translateKey(config.hideCommand))
    sendReactMessage('registerHint', Hints[id])
end)

exports('setAction', function(id, data)
    local hintData = Hints[id]
    if not hintData then return end

    if data.key then
        hintData.action.key = isCommand(data.key) and translateKey(data.key) or asString(data.key)
    end

    if data.text then
        hintData.action.text = asString(data.text)
    end

    if ActiveHint == id then
        sendReactMessage('registerHint', Hints[id])
    end
end)

exports('setHeader', function(id, data)
    local hintData = Hints[id]
    if not hintData then return end

    if data.title then
        hintData.header.title = asString(data.title)
    end

    if data.description then
        hintData.header.description = asString(data.description)
    end

    if data.icon then
        hintData.header.icon = asString(data.icon)
    end

    if ActiveHint == id then
        sendReactMessage('registerHint', hintData)
    end
end)

exports('setProgress', function(id, data)
    local hintData = Hints[id]
    if not hintData then return end

    if data.progress then
        hintData.progress.progress = asNumber(data.progress)
    end

    if data.max then
        hintData.progress.max = asNumber(data.max)
    end

    if data.title then
        hintData.progress.title = asString(data.title)
    end

    if ActiveHint == id then
        sendReactMessage('registerHint', Hints[id])
    end
end)

exports('addExtra', function(id, data)
    local hintData = Hints[id]
    if not hintData then return end

    if #hintData.extra >= 2 then
        return
    end

    hintData.extra[#hintData.extra + 1] = {
        title = asString(data.title),
        description = asString(data.description),
        icon = asString(data.icon)
    }

    if ActiveHint == id then
        sendReactMessage('registerHint', Hints[id])
    end

    return true
end)

exports('removeExtra', function(id, title)
    local hintData = Hints[id]
    if not hintData then return end

    for i = 1, #hintData.extra do
        if hintData.extra[i].title == title then
            table.remove(hintData.extra, i)
            if ActiveHint == id then
                sendReactMessage('registerHint', Hints[id])
            end
            return true
        end
    end

    return false
end)

exports('hide', function(id)
    if ActiveHint ~= id then return end

    sendReactMessage('hide')
    ActiveHint = nil
end)

AddEventHandler("onResourceStop", function(resource)
    if resource ~= GetCurrentResourceName() then return end

    for id, hint in pairs(Hints) do
        if hint.resource == resource then
            Hints[id] = nil

            if ActiveHint == id then
                ActiveHint = nil
                sendReactMessage('hide')
            end

            break
        end
    end
end)