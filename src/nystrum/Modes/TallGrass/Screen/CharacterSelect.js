import React from 'react';
import { CARTRIDGE } from '../../../Nystrum';
import { SCREENS } from '../../../Screen/constants';

class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Title">
        <div
          className="Title__content"
          style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: CARTRIDGE.theme.main,
          }}
        >
          <h2>Something In The Tall Grass</h2>
          <button
            style={{
              backgroundColor: CARTRIDGE.theme.accent,
              color: CARTRIDGE.theme.main,
            }}
            className={`btn btn-main`}
            onClick={() => {
              this.props.setSelectedCharacter(this.props.characters[0])
              this.props.setActiveScreen(SCREENS.LEVEL)
            }}
          >
            Light the Lantern, Enter The Dark
          </button>
        </div>
      </div>
    );
  }
}

export default Title;