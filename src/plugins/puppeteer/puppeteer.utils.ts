import puppeteer, { Browser } from 'puppeteer';

type BrowserState = {
  activeBrowserInstance: Browser | null;
  launchInProgress: Promise<Browser> | null;
};

const browserState: BrowserState = {
  activeBrowserInstance: null,
  launchInProgress: null,
};

export const getSharedBrowserInstance = async (): Promise<Browser> => {
  if (browserState.activeBrowserInstance) {
    return browserState.activeBrowserInstance;
  }

  if (browserState.launchInProgress) {
    return browserState.launchInProgress;
  }

  const launching = puppeteer
    .launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    .then((launchedBrowser) => {
      browserState.activeBrowserInstance = launchedBrowser;
      browserState.launchInProgress = null;

      launchedBrowser.on('disconnected', () => {
        browserState.activeBrowserInstance = null;

        browserState.launchInProgress = null;
      });

      return launchedBrowser;
    })
    .catch((error) => {
      browserState.launchInProgress = null;

      throw error;
    });

  browserState.launchInProgress = launching;

  return launching;
};

export const closeSharedBrowserInstance = async (): Promise<void> => {
  if (browserState.activeBrowserInstance) {
    await browserState.activeBrowserInstance.close();

    browserState.activeBrowserInstance = null;
  }
};
