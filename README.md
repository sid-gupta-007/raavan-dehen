# Ravan Dahan · Mela mein chalo

## Start the game

Double-click `start-game.bat`. It serves the game locally and opens `http://127.0.0.1:4173/`. Leave the minimized server window open while playing. Press Ctrl+C in that window to stop it.

Opening `index.html` directly as a `file://` URL will not work: browsers block JavaScript modules and the `.glb` model on file pages.

## Controls

- **WASD / arrow keys:** walk through the fair
- **Mouse drag:** look around; a normal mouse click fires a burning arrow
- **Space:** fire an arrow
- **Shift:** run
- **Touch:** drag the world to look, use the left joystick to walk, and press Shoot

Walk along the central mela lane toward the Ravana effigy. Hit it with a burning arrow to start a close frontal Dahan view, roughly 47 seconds of gradual burning, vertical sparks on the effigy, rising smoke, and upward-launching fireworks for about 57 seconds. The sound button controls the local mela bhajan while roaming, crowd ambience, and the supplied Jai Shri Ram and fireworks tracks during the Dahan. Fireworks audio is mixed louder than the chant. Sound starts after you enter so the browser can enable playback.

The walkable Three.js scene follows the nighttime mela reference: a lit entrance arch, bulb strings and bunting, food stalls, fairground wheel, visitors, and the effigy at the end of the lane. It loads `ravan-optimized.glb` (about 19.2 MB, down from the original 70.5 MB); `ravan.glb` remains unchanged as a source backup. Three.js and the Meshopt decoder load from jsDelivr, so the first start needs an internet connection.
