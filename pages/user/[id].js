import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Card } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { initialState as postInitialState } from '../../reducers/post';
import { initialState as userInitialState } from '../../reducers/user';
import { loadUserPosts, loadUserPostsAPI } from '../../actions/post';
import { loadMyInfoAPI } from '../../actions/user';
import PostCard from '../../components/PostCard';
import AppLayout from '../../components/AppLayout';

const User = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);
  const { userInfo, me } = useSelector((state) => state.user);

  useEffect(() => {
    const onScroll = () => {
      if (hasMorePosts && !loadPostsLoading) {
        if ((window.pageYOffset + document.documentElement.clientHeight)
          > (document.documentElement.scrollHeight - 300)) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch(loadUserPosts({
            lastId,
            userId: id,
          }));
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts.length, hasMorePosts, id, loadPostsLoading]);

  return (
    <AppLayout>
      {userInfo && (
        <Head>
          <title>
            {userInfo.nickname}
            님의 글
          </title>
          <meta property="og:url" content={`https://sorayeon.shop/post/${id}`} />
          <meta name="description" content={`${userInfo.nickname}님의 게시글`} />
          <meta property="og:title" content={`${userInfo.nickname}님의 게시글`} />
          <meta property="og:description" content={`${userInfo.nickname}님의 게시글`} />
          <meta property="og:image" content="https://sorayeon.shop/favicon.ico" />
          <meta property="og:url" content={`https://sorayeon.shop/user/${id}/posts`} />
        </Head>
      )}
      {userInfo && (userInfo.id !== me?.id)
        ? (
          <div style={{ padding: 15, background: '#ececec', marginBottom: 20 }}>
            <Card
              actions={[
                <div key="twit">
                  짹짹
                  <br />
                  {userInfo.Posts}
                </div>,
                <div key="following">
                  팔로잉
                  <br />
                  {userInfo.Followings}
                </div>,
                <div key="follower">
                  팔로워
                  <br />
                  {userInfo.Followers}
                </div>,
              ]}
            >
              <Card.Meta
                avatar={(
                  <Link href={`/user/${userInfo.id}`}>
                    <a><Avatar>{userInfo.nickname[0]}</Avatar></a>
                  </Link>
                )}
                title={userInfo.nickname}
              />
            </Card>
          </div>
        )
        : null}
      {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
};

export async function getServerSideProps(context) {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  const results = await Promise.allSettled([
    loadUserPostsAPI({ userId: context.params.id }),
    loadMyInfoAPI(),
  ]);
  const [posts, myInfo] = results.map((result) => result.value.data);
  return {
    props: {
      initialState: {
        user: {
          ...userInitialState,
          loadMyInfoDone: true,
          me: myInfo,
        },
        post: {
          ...postInitialState,
          loadPostsDone: true,
          mainPosts: posts,
          hasMorePosts: posts.length === 10,
        },
      },
    },
  };
}

export default User;
