import React from 'react';
import {mount} from 'enzyme';

import SearchBar from 'app/views/stream/searchBar';
import TagStore from 'app/stores/tagStore';

describe('SearchBar', function() {
  let sandbox;
  let options;
  let urlTagValuesMock;
  let supportedTags;
  const clickInput = searchBar => {};

  beforeEach(function() {
    TagStore.reset();
    TagStore.onLoadTagsSuccess(TestStubs.Tags());
    supportedTags = TagStore.getAllTags();

    sandbox = sinon.sandbox.create();

    options = {
      context: {organization: {id: '123'}},
    };

    urlTagValuesMock = MockApiClient.addMockResponse({
      url: '/projects/123/456/tags/url/values/',
      body: [],
    });
  });

  afterEach(function() {
    MockApiClient.clearMockResponses();
    sandbox.restore();
  });

  describe('updateAutoCompleteItems()', function() {
    let clock;

    beforeEach(function() {
      clock = sandbox.useFakeTimers();
    });
    afterEach(function() {
      clock.restore();
    });

    it('sets state with complete tag', function() {
      let props = {
        orgId: '123',
        projectId: '456',
        query: 'url:"fu"',
        supportedTags,
      };
      let searchBar = mount(<SearchBar {...props} />, options);
      clickInput(searchBar);
      clock.tick(301);
      expect(searchBar.state.searchTerm).toEqual('"fu"');
      expect(searchBar.state.searchItems).toEqual([]);
      expect(searchBar.state.activeSearchItem).toEqual(0);
      expect(urlTagValuesMock).toHaveBeenCalledWith();
    });

    it('sets state when value has colon', function() {
      let props = {
        orgId: '123',
        projectId: '456',
        query: 'url:"http://example.com"',
        supportedTags,
      };

      let searchBar = mount(<SearchBar {...props} />, options);
      clickInput(searchBar);
      expect(searchBar.state.searchTerm).toEqual('"http://example.com"');
      expect(searchBar.state.searchItems).toEqual([]);
      expect(searchBar.state.activeSearchItem).toEqual(0);
      clock.tick(301);

      expect(urlTagValuesMock).toHaveBeenCalledWith();
    });

    it('does not request values when tag is `timesSeen`', function() {
      // This should never get called
      let mock = MockApiClient.addMockResponse({
        url: '/projects/123/456/tags/timesSeen/values/',
        body: [],
      });
      let props = {
        orgId: '123',
        projectId: '456',
        query: 'timesSeen:',
        supportedTags,
      };
      let searchBar = mount(<SearchBar {...props} />, options);
      clickInput(searchBar);
      clock.tick(301);
      expect(mock).not.toHaveBeenCalled();
    });
  });
});
