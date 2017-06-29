import { OSPage } from './app.po';

describe('os App', () => {
  let page: OSPage;

  beforeEach(() => {
    page = new OSPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
