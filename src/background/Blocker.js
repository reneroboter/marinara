import { Phase } from './Timer';
import { SettingsClient} from '../background/Services';
class Blocker
{
  constructor(timer) {
    this.timer = timer;
  }

  async apply() {
    let { blockListDomains: urlsToBeBlocked } = await SettingsClient.once.getSettings();
    console.log(urlsToBeBlocked)
    console.log(chrome.webRequest.onBeforeRequest.hasListeners())
    // wenn schon ein listener vorhanden ist, muss der alte ersetzt werden, weil sonst alle urls im speicher bleiben?!
    // todo check if all urls where valid or filter ..
    // https://stackoverflow.com/questions/23001428/chrome-webrequest-onbeforerequest-removelistener-how-to-stop-a-chrome-web
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
