import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { getSession } from 'next-auth/react';

import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import { useInvitations, useWorkspaces } from '@/hooks/data/index';
import { AccountLayout } from '@/layouts/index';
import api from '@/lib/common/api';
import { useWorkspace } from '@/providers/workspace';
import { useTranslation } from "react-i18next";

const Welcome = ({ serverInvitations, serverWorkspaces }) => {
  const router = useRouter();
  const { data: invitationsData, isLoading: isFetchingInvitations } =
    useInvitations(serverInvitations);
  const { data: workspacesData, isLoading: isFetchingWorkspaces } =
    useWorkspaces(serverWorkspaces);
  const { setWorkspace } = useWorkspace();
  const { t } = useTranslation();
  const [isSubmitting, setSubmittingState] = useState(false);

  const accept = (memberId) => {
    setSubmittingState(true);
    api(`/api/workspace/team/accept`, {
      body: { memberId },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Accepted invitation!');
      }
    });
  };

  const decline = (memberId) => {
    setSubmittingState(true);
    api(`/api/workspace/team/decline`, {
      body: { memberId },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Declined invitation!');
      }
    });
  };

  const navigate = (workspace) => {
    setWorkspace(workspace);
    router.replace(`/account/${workspace.slug}`);
  };

  return (
    <AccountLayout>
      <Meta title="Nextacular - Dashboard" />
      <Content.Title
        title={t('workspace.dashboard.header.title')}
        subtitle={t("workspace.dashboard.header.description")}
      />
      <Content.Divider />
      <Content.Container>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {isFetchingWorkspaces ? (
            <Card>
              <Card.Body />
              <Card.Footer />
            </Card>
          ) : workspacesData?.workspaces.length > 0 ? (
            workspacesData.workspaces.map((workspace, index) => (
              <Card key={index}>
                <Card.Body title={workspace.name} />
                <Card.Footer>
                  <button
                    className="text-blue-600"
                    onClick={() => navigate(workspace)}
                  >
                    Select workspace &rarr;
                  </button>
                </Card.Footer>
              </Card>
            ))
          ) : (
            <Card.Empty>{t('workspace.message.createworkspace')}</Card.Empty>
          )}
        </div>
      </Content.Container>
      <Content.Divider thick />
      <Content.Title
        title={t("workspace.dashboard.header.invitations.title")}
        subtitle={t("workspace.dashboard.header.invitations.description")}
      />
      <Content.Divider />
      <Content.Container>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {isFetchingInvitations ? (
            <Card>
              <Card.Body />
              <Card.Footer />
            </Card>
          ) : invitationsData?.invitations.length > 0 ? (
            invitationsData.invitations.map((invitation, index) => (
              <Card key={index}>
                <Card.Body
                  title={invitation.workspace.name}
                  subtitle={`You have been invited by ${invitation.invitedBy.name || invitation.invitedBy.email
                    }`}
                />
                <Card.Footer>
                  <Button
                    className="text-white bg-blue-600 hover:bg-blue-500"
                    disabled={isSubmitting}
                    onClick={() => accept(invitation.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white"
                    disabled={isSubmitting}
                    onClick={() => decline(invitation.id)}
                  >
                    Decline
                  </Button>
                </Card.Footer>
              </Card>
            ))
          ) : (
            <Card.Empty>
              {t("workspace.team.invitations.empty.message")}
            </Card.Empty>
          )}
        </div>
      </Content.Container>
    </AccountLayout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  // Fetch initial data server-side
  const [invitationsResponse, workspacesResponse] = await Promise.all([
    fetch(`${process.env.NEXTAUTH_URL}/api/workspaces/invitations`, {
      headers: {
        Cookie: context.req.headers.cookie,
      },
    }),
    fetch(`${process.env.NEXTAUTH_URL}/api/workspaces`, {
      headers: {
        Cookie: context.req.headers.cookie,
      },
    }),
  ]);

  const [serverInvitations, serverWorkspaces] = await Promise.all([
    invitationsResponse.json(),
    workspacesResponse.json(),
  ]);

  return {
    props: {
      session,
      serverInvitations,
      serverWorkspaces,
    },
  };
}

export default Welcome;
