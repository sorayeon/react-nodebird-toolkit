import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import PostCard from '../../components/PostCard';
import { initialState as userInitialState } from '../../reducers/user';
import { initialState as postInitialState } from '../../reducers/post';
import { loadMyInfoAPI } from '../../actions/user';
import { loadHashtagPosts, loadHashtagPostsAPI } from '../../actions/post';
import AppLayout from '../../components/AppLayout';

const Hashtag = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tag } = router.query;
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);

  useEffect(() => {
    const onScroll = () => {
      if (hasMorePosts && !loadPostsLoading) {
        if ((window.pageYOffset + document.documentElement.clientHeight)
          > (document.documentElement.scrollHeight - 300)) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch(loadHashtagPosts({
            lastId,
            hashtag: tag,
          }));
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts.length, hasMorePosts, tag, loadPostsLoading]);

  return (
    <AppLayout>
      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
      ))}
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
    loadHashtagPostsAPI({ hashtag: context.params.tag }),
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

export default Hashtag;
