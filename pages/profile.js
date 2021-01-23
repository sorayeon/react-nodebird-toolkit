import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import { message } from 'antd';
import axios from 'axios';
import useSWR from 'swr';
import AppLayout from '../components/AppLayout';
import FollowList from '../components/FollowList';
import NicknameEditForm from '../components/NicknameEditForm';
import { initialState as userInitialState } from '../reducers/user';
import { loadMyInfoAPI } from '../actions/user';

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  useEffect(() => {
    if (!(me && me.id)) {
      message.warn('로그인 후 이용해 주시길 바랍니다.').then();
      Router.push('/').then();
    }
  }, [me && me.id]);

  const { data: followersData, error: followerError } = useSWR((me && me.id) ? `/user/followers?limit=${followersLimit}` : null, fetcher);
  const { data: followingsData, error: followingError } = useSWR((me && me.id) ? `/user/followings?limit=${followingsLimit}` : null, fetcher);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);
  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  if (!me) {
    return null;
  }

  // 주의 return 이 hooks 보다 위에 있으면 안됨
  if (followerError || followingError) {
    console.error(followerError, followingError);
    return <div>팔로잉/팔로워 로딩 중 에러가 발생합니다.</div>;
  }

  return (
    <AppLayout>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <NicknameEditForm />
      {followingsData && (
        <FollowList
          header="팔로잉"
          data={followingsData}
          onClickMore={loadMoreFollowings}
          loading={!followingsData && !followingError}
        />
      )}
      {followersData && (
        <FollowList
          header="팔로워"
          data={followersData}
          onClickMore={loadMoreFollowers}
          loading={!followersData && !followerError}
        />
      )}
    </AppLayout>
  );
};

// SSR (프론트 서버에서 실행)
export async function getServerSideProps(context) {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  // 쿠키가 브라우저에 있는경우만 넣어서 실행
  // (주의, 아래 조건이 없다면 다른 사람으로 로그인 될 수도 있음)
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  const results = await Promise.allSettled([loadMyInfoAPI()]);
  const [myInfo] = results.map((result) => result.value.data);
  return {
    props: {
      initialState: {
        user: {
          ...userInitialState,
          loadMyInfoDone: true,
          me: myInfo,
        },
      },
    },
  };
}

export default Profile;
