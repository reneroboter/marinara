import { Phase } from './Timer';
import { SettingsClient} from '../background/Services';
class Blocker
{
  constructor(timer) {
    this.timer = timer;
  }

  async apply() {
    let { blockListDomains: urlsToBeBlocked } = await SettingsClient.once.getSettings();

    chrome.webRequest.onBeforeRequest.addListener(() => {
          if (this.timer.phase === Phase.Focus && this.timer.isRunning) {
            return {cancel: true};
          }
        },
        {
          urls: urlsToBeBlocked.split(',').map(url => '*://*.' + url.trim() + '/*'),
        },
        ["blocking"]
    );
  }

}

export {
  Blocker
};
