/* eslint-disable react-hooks/exhaustive-deps */
import PostCard from "./PostCard";
import Card from "./Card";
import FriendInfo from "./FriendInfo";
import Link from "next/link"
import { useEffect, useRef, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersection } from "@mantine/hooks";
import { ShimmerSocialPost, ShimmerThumbnail } from "react-shimmer-effects";
import { LazyLoadImage } from "react-lazy-load-image-component";
export default function ProfileContent({ activeTab, userId }) {

  const supabase = useSupabaseClient();

  async function userPosts(nextPage, pageSize) {
    return supabase.from('posts')
      .select('id, content, created_at, photos, profiles(id, avatar, name)')
      .is('parent', null)
      .order('created_at', { ascending: false })
      .eq('author', userId)
      .range(nextPage * pageSize, (nextPage + 1) * pageSize - 1)

  }

  async function userPhotos(nextPage, pageSize) {
    return supabase.from('posts')
      .select('id, photos')
      .eq('author', userId)
      .is('parent', null)
      .order('created_at', { ascending: false })
      .range(nextPage * pageSize, (nextPage + 1) * pageSize - 1)
  }

  const {
    data: photoData,
    fetchNextPage: nextPhotos,
    hasNextPage: hasnextPhotos,
    status: photoStatus,
    isFetchingNextPage: isFetchingNextPhotos } = useInfiniteQuery(
      ["myphotos", userId],
      async ({ pageParam = 0 }) => {
        const res = await userPhotos(pageParam, 20)
        const filteredPosts = res.data.filter(post => post.photos !== null && post.photos.length > 0);
        return filteredPosts
      },
      {
        enabled: !!userId && activeTab === "photos",
        getNextPageParam: (lastPage, allPages) => {
          // console.log({ lastPage, allPages });
          const lastpost = lastPage[lastPage?.length - 1] || null
          return lastpost?.id
        }

      }
    )

  const { data: postData, fetchNextPage: nextPosts, isFetchingNextPage, hasNextPage, status } = useInfiniteQuery(
    ["myposts", userId],
    async ({ pageParam = 0 }) => {
      const res = await userPosts(pageParam, 3)
      return res.data
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        // console.log({ lastPage, allPages });
        if (lastPage.length === 3) {
          return allPages.length // Retourne le numéro de page suivant
        } else {
          return false // Indique qu'il n'y a plus de pages à récupérer
        }
      },
      enabled: activeTab === "posts"

    }
  )

  const lastPostRef = useRef(null)
  const { ref: postref, entry: postEntry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  })



  useEffect(() => {
    if (activeTab === 'posts') {
      if (postEntry?.isIntersecting && hasNextPage) nextPosts()
    }
  }, [postEntry, activeTab]);



  const posts = postData?.pages.flatMap((page) => page)
  const postPhotos = photoData?.pages.flatMap((page) => page)
  console.log({ postPhotos, photoStatus });

  return (
    <div>
      {activeTab === 'posts' ?

        status === "success" ?
          <div className="max-h-[60vh] overflow-y-scroll overflow-x-hidden">
            {
              posts?.map((post, i) => {
                if (i === posts.length - 1) {
                  return (
                    <div key={post.id} ref={postref}>
                      <PostCard {...post} />
                    </div>
                  )
                } else {
                  return (
                    <div key={post.id}>
                      <PostCard {...post} />
                    </div>
                  )
                }

              })
            }
          </div>
          :
          <>
            <ShimmerSocialPost type="both" />
            <ShimmerSocialPost type="both" />
          </>
        :
        null
      }
      {activeTab === 'about' && (
        <div>
          <Card>
            <h2 className="text-3xl mb-2">About me</h2>
            <p className="mb-2 text-sm">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut doloremque harum maxime mollitia perferendis praesentium quaerat. Adipisci, delectus eum fugiat incidunt iusto molestiae nesciunt odio porro quae quaerat, reprehenderit, sed.</p>
            <p className="mb-2 text-sm">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet assumenda error necessitatibus nesciunt quas quidem quisquam reiciendis, similique. Amet consequuntur facilis iste iure minima nisi non praesentium ratione voluptas voluptatem?</p>
          </Card>
        </div>
      )}
      {activeTab === 'friends' && (
        <div>
          <Card>
            <h2 className="text-3xl mb-2">Friends</h2>
            <div className="">
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
            </div>
          </Card>
        </div>
      )}
      {activeTab === 'photos' && (
        <div>
          <Card>
            <div className="grid md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-scroll overflow-x-hidden">
              {
                photoStatus === "success" && postPhotos ?
                  postPhotos.map((post, i) => {

                    if (post.photos.length < 2) {
                      return (
                        <Link href={`/post/${post.id}`} key={post.id}>
                          <div className="rounded-md overflow-hidden h-48 flex items-center shadow-md">
                            <LazyLoadImage effect="blur" alt="photoPost" className="w-full h-ull" src={post.photos[0]} placeholder={<ShimmerThumbnail />} />
                          </div>
                        </Link>
                      )
                    } else {
                      return (
                        <>
                          {
                            post.photos.map((photo, i) => {
                              return (
                                <Link href={`/post/${post.id}`} key={i}>
                                  <div className="rounded-md overflow-hidden h-48 flex items-center shadow-md">
                                    <LazyLoadImage effect="blur" alt="photoPost" className="w-full h-ull" src={photo} placeholder={<ShimmerThumbnail />} />
                                  </div>
                                </Link>
                              )

                            })
                          }
                        </>
                      )
                    }


                  })
                  :
                  <>
                    <ShimmerThumbnail rounded={true} />
                    <ShimmerThumbnail rounded={true} />
                    <ShimmerThumbnail rounded={true} />
                    <ShimmerThumbnail rounded={true} />
                  </>
              }
            </div>
            {/* {hasnextPhotos && (
              <button className="bg-blue-500 mt-2 disabled:bg-gray-400 p-4 rounded-sm shadow-md text-white font-semibold" onClick={() => nextPhotos()} disabled={isFetchingNextPhotos}>
                {isFetchingNextPhotos ? 'Chargement...' : 'Afficher plus'}
              </button>
            )} */}
          </Card>
        </div>
      )}
    </div>
  );
}

//  <Link href={`/post/`} key={photo.id}>
//   <div className="rounded-md overflow-hidden h-48 flex items-center shadow-md">
//     <LazyLoadImage effect="blur" alt="photoPost" className="w-full h-ull" src="" placeholder={<ShimmerThumbnail />} />
//   </div>
// </Link> 