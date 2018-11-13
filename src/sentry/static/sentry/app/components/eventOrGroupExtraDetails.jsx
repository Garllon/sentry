import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';
import createReactClass from 'create-react-class';
import {Link} from 'react-router';
import {Flex, Box} from 'grid-emotion';

import ProjectState from 'app/mixins/projectState';
import TimeSince from 'app/components/timeSince';
import ShortId from 'app/components/shortId';
import overflowEllipsis from 'app/styles/overflowEllipsis';
import {t, tct} from 'app/locale';
import InlineSvg from 'app/components/inlineSvg';

const EventOrGroupExtraDetails = createReactClass({
  displayName: 'EventOrGroupExtraDetails',

  propTypes: {
    orgId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    groupId: PropTypes.string.isRequired,
    lastSeen: PropTypes.string,
    firstSeen: PropTypes.string,
    subscriptionDetails: PropTypes.shape({
      reason: PropTypes.string,
    }),
    numComments: PropTypes.number,
    logger: PropTypes.string,
    annotations: PropTypes.arrayOf(PropTypes.string),
    assignedTo: PropTypes.shape({
      name: PropTypes.string,
    }),
    showAssignee: PropTypes.bool,
    shortId: PropTypes.string,
  },

  mixins: [ProjectState],

  render() {
    let {
      orgId,
      projectId,
      groupId,
      lastSeen,
      firstSeen,
      subscriptionDetails,
      numComments,
      logger,
      assignedTo,
      annotations,
      showAssignee,
      shortId,
    } = this.props;

    return (
      <GroupExtra align="center">
        {shortId && (
          <Box mr={2}>
            <GroupShortId shortId={shortId} />
          </Box>
        )}
        <Flex align="center" mr={2}>
          <div css={overflowEllipsis}>
            {lastSeen && (
              <React.Fragment>
                <GroupTimeIcon src="icon-clock-sm" />
                <TimeSince date={lastSeen} suffix={t('ago')} />
              </React.Fragment>
            )}
            {firstSeen &&
              lastSeen && <span className="hidden-xs hidden-sm">&nbsp;—&nbsp;</span>}
            {firstSeen && (
              <TimeSince
                date={firstSeen}
                suffix={t('old')}
                className="hidden-xs hidden-sm"
              />
            )}
          </div>
        </Flex>
        <GroupExtraCommentsAndLogger>
          {numComments > 0 && (
            <Box mr={2}>
              <Link
                to={`/${orgId}/${projectId}/issues/${groupId}/activity/`}
                className="comments"
              >
                <GroupExtraIcon
                  src="icon-comment-sm"
                  mentioned={
                    subscriptionDetails && subscriptionDetails.reason === 'mentioned'
                  }
                />
                <span>{numComments}</span>
              </Link>
            </Box>
          )}
          {logger && (
            <Box className="event-annotation" mr={2}>
              <Link
                to={{
                  pathname: `/${orgId}/${projectId}/`,
                  query: {
                    query: 'logger:' + logger,
                  },
                }}
              >
                {logger}
              </Link>
            </Box>
          )}
        </GroupExtraCommentsAndLogger>
        {annotations &&
          annotations.map((annotation, key) => {
            return (
              <div
                className="event-annotation"
                dangerouslySetInnerHTML={{
                  __html: annotation,
                }}
                key={key}
              />
            );
          })}

        {showAssignee &&
          assignedTo && <div>{tct('Assigned to [name]', {name: assignedTo.name})}</div>}
      </GroupExtra>
    );
  },
});

const GroupExtra = styled(Flex)`
  color: ${p => p.theme.gray3};
  font-size: 12px;
  a {
    color: inherit;
  }
`;

const GroupExtraCommentsAndLogger = styled(Flex)`
  color: ${p => p.theme.gray4};
`;

const GroupExtraIcon = styled(InlineSvg)`
  color: ${p => (p.isMentioned ? p.theme.green : null)};
  font-size: 11px;
  margin-right: 4px;
`;

const GroupTimeIcon = styled(GroupExtraIcon)`
  /* this is solely for optics, since TimeSince always begins
  with a number, and numbers do not have decenders */
  transform: translateY(-1px);
`;

const GroupShortId = styled(ShortId)`
  font-size: 12px;
  color: ${p => p.theme.gray3};
`;

export default EventOrGroupExtraDetails;
