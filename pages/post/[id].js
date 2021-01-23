// post/[id].js
import React from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import { initialState as userInitialState } from '../../reducers/user';
import { initialState as postInitialState } from '../../reducers/post';
import { loadMyInfoAPI } from '../../actions/user';
import { loadPostAPI } from '../../actions/post';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { singlePost } = useSelector((state) => state.post);
  return (
    <AppLayout>
      <Head>
        <title>{singlePost.User.nickname} 님의 글</title>
        <meta name="description" content={singlePost.content} />
        <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
        <meta property="og:description" content={singlePost.content} />
        <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://sorayeon.shop/favicon.ico'} />
        <meta property="og:url" content={`https://sorayeon.shop/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
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
  const results = await Promise.allSettled([
    loadPostAPI({ postId: context.params.id }),
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
          singlePost: posts,
        },
      },
    },
  };
}
export default Post;
