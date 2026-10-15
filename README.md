# BlurView + react-native-screens: black screen on push (Android)

Minimal reproduction for:

- https://github.com/sbaiahmed1/react-native-blur/issues/167
- https://github.com/software-mansion/react-native-screens/issues/4930

On Android, a `BlurView` used as the background of a custom bottom tab bar makes the native-stack
push transition fail: the pushed screen never becomes visible (black screen in our app, the window
background in this repro). When navigating back, its content shows for a moment during the exit
animation.

## Setup

| Package | Version |
| --- | --- |
| react-native | 0.86.0 (New Architecture) |
| @sbaiahmed1/react-native-blur | 6.0.1 |
| react-native-screens | 4.26.2 |
| @react-navigation/native | 7.3.8 |
| @react-navigation/native-stack | 7.17.10 |
| @react-navigation/bottom-tabs | 7.18.8 |

Navigation structure (see `App.tsx`):

```
Root native stack
└── Bottom tabs (custom tab bar with a BlurView background)
    ├── HomeTab: native stack (Home → Details, default animation)
    └── OtherTab
```

## Steps to reproduce

```bash
npm install
npm run android
```

1. On the Home tab, tap **Push "Details"**.
2. The Home screen slides out, but the Details screen never fades in: the whole area shows the
   window background (light grey with this template's theme). Meanwhile the blurred tab bar turns
   dark, because the blur capture does see the (dark) Details screen behind it.
3. Press back: the Details content is visible for a moment during the exit animation, then Home is
   shown.

Tested on an Android 14 emulator.

## Expected

The Details screen animates in with the default transition and is visible.

## Notes

- Replacing the `<BlurView>` in `BlurTabBar` (`App.tsx`) with a plain `<View>` makes the push work.
- With `animation: 'slide_from_right'` or `'none'` on the stack the Details screen is visible, because
  those transitions have no alpha component.
- Root cause analysis and a workaround patch for react-native-screens are in the issues linked above.
