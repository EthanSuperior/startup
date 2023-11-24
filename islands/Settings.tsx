import { OnLoad } from "./Otrio.tsx";

export default function PlaySettings() {
  return (
    <div style="display: none;">
      <div width="fit-content">
        <div id="settings" style="text-align: center;">
          <div style="width: 20%; display: inline-block; vertical-align: top">
            <button type="button" class="collapsible">Setting</button>
            <div class="content" id="util_setting">
              <label for="player-count">Number of Players</label>
              <input
                type="number"
                id="player-count"
                min="2"
                max="4"
                step="1"
                value="2"
                onChange={OnLoad}
              />
              <br />
              <label for="checkbox-corpse">Use Corpses</label>
              <input
                checked
                id="checkbox-corpse"
                value="hasCorpse"
                type="checkbox"
                onChange={OnLoad}
              />
              <br />
              <label for="game-width">Image Scale</label>
              <input
                type="number"
                id="game-width"
                value="14"
                min="2"
                step="1"
                onChange={OnLoad}
              />
              <br />
              <label for="game-size">Board Size</label>
              <input
                type="number"
                id="game-size"
                value="3"
                min="3"
                step="1"
                onChange={OnLoad}
              />
              <br />
              <label for="blank-alpha">Alpha Values</label>
              <br />
              <label for="blank-alpha">Blanks Alpha</label>
              <input
                type="number"
                id="blank-alpha"
                value="51"
                min="0"
                max="255"
                step="1"
              />
              <label for="corpse-alpha">Corpse Alpha</label>
              <input
                type="number"
                id="corpse-alpha"
                value="102"
                min="0"
                max="255"
                step="1"
              />
            </div>
          </div>
          <div style="width: 40%; display: inline-block; vertical-align: top">
            <button type="button" class="collapsible">Colors</button>
            <div class="content" id="colors">
              <div>
                {
                  /*
                                 <label for="bkgrd_color">Bkgd|Nil</label>
                                 <input
                                    id="bkgrd_color"
                                    type="color"
                                    style="width: 35%"
                                    onChange={changeBGColor}
                                /><input
                                    id="empty_color"
                                    type="color"
                                    style="width: 35%"
                                    onFocus={this.setAttribute('old_color', this.value)}
                                    onChange={exchange_colors(this,null,0)}
                                /> */
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
