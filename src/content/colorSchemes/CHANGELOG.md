# v2.5.0 Nov 05, 2025 
- **NEW**: Added two new premium voices for enhanced listening experience
  - "Mona" - High-quality female voice with natural intonation
  - "Bob" - Professional male voice with clear pronunciation
- **IMPROVED**: Significantly enhanced text-to-speech performance
  - Better text extraction from paragraphs for more accurate pronunciation
  - Fixed audio prefetching issues that caused reading interruptions
  - Smoother transitions between paragraphs during continuous reading
- **IMPROVED**: Updated UI controls for better user experience
  - Replaced type controls button with a more intuitive settings icon
  - Enhanced visual consistency across all interface elements


# v2.4.0 Nov 04, 2025
- **NEW**: Added translation feature - translate any paragraph with a simple click
  - Inline translation panels appear directly under each paragraph
  - Support for 20+ languages with auto-detection
  - Copy and speak translated text functionality
  - Persistent language preference settings
- **NEW**: Added 3 new display options in the style dropdown:
  - Sticky header: Keep the reader header pinned to the top while scrolling
  - Hide audio icons: Clean up the interface by hiding speaker icons
  - Hide translate icons: Minimize visual clutter by hiding translation icons
- **IMPROVED**: Enhanced paragraph interaction with subtle visual effects
  - Loading animations for translation requests
  - Success/error feedback for translation actions
  - Improved hover states and visual indicators

# v2.3.1 Nov 01, 2025
- Fix when globalSettings is null for new user.

# v2.3.0 Nov 01, 2025
- Added a custom font page, allowing users to add and manage local fonts.
- Improved responsive UI for the options page on Firefox for Android.

# v2.2.0 Oct 31, 2025
- Added support for Firefox on Android!
- Improved responsive UI for Android devices.
- Prevented page flash when auto-enabling reader mode by hiding the unstyled original page.
- Reader mode no longer auto-enables when the page host changes.
- Increased player z-index to prevent overlap from Google ads.

# v2.1.1 Oct 27, 2025 
- Improved responsive design, especially for mobile devices.
- Fixed a caching issue where large text could trigger a storage quota exceeded error.

# v2.1.0 Oct 26, 2025
- Added automatic page turning for continuous reading, works nicely on websites like Royalroad or scribble.
- Improved "read whole page" mode: now continues reading even if a paragraph is selected.
- Added a visual indicator for "read whole page" mode.
- Fixed error banner overlapping dropdown selectors.
- Fixed an issue where short text could block reading.
- Fixed "continue reading" not working when the voice was changed.

# v2.0.0 Oct 23, 2025
- Added an audio player: users can now select any text to have it read aloud.
- Refined the theme selector: added a color preview icon for each theme.
- Improved the reading page appearance: enhanced background, border, and shadow for a more paper-like feel.
- Added support for loading PDFs from arXiv and additional sites.


# v1.3.0 May 04, 2025
- Added support for opening PDF files directly in PNL PDF Reader (Chrome-based browsers only).
- Fixed an issue preventing word lookups using Dictionariez.
- Introduced support for custom article content selectors and styles stored in local storage.

# v1.2.0 Apr 09, 2025
- Cleared the webpage's head section when the reader is enabled to prevent original styles from interfering.
- Fixed an issue where exiting reader mode failed if the background script was inactive.
- Ensured the page always reloads upon exiting reader mode for consistent behavior.

# v1.1.1 Mar 27, 2025 
- Updated fonts to support extended character sets, including Latin-Ext, Cyrillic, and Vietnamese.
- Introduced tooltips to provide clarity when selecting font types.
- Added a print button to facilitate easy printing of content.

# v1.1.0 Mar 23, 2025
- Introduced font type customization for enhanced readability.
- Added line spacing and line width adjustment options.
- Enabled justified text alignment for a cleaner look.
- Expanded theme library with additional handwriting and monospace styles.
- Implemented global settings configuration for streamlined customization.
- Enhanced mobile support for a better user experience.


# v1.0.2 Mar 02, 2025
- Ensured reader mode remains active on the same tab even after a refresh.
- Fixed an issue where the content script message couldn't wake up the service worker, preventing reader mode activation.
- Added multiple new themes.
- Improved mobile support with minimal effort.

# v1.0.1 Feb 27, 2025

- Resolved an issue where the reader mode couldn't be activated after installation.
- Fixed a problem where the content script could be injected twice.

# v1.0.0 Feb 26, 2025

The first version of PNL Reader is released, featuring:

- Basic light and dark themes
- Font-size adjustment functionality
- Initial user interface design

This release marks the beginning of PNL Reader's journey in providing customizable reading experiences.