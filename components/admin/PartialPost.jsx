/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import Link from "next/link";
import ReactTimeAgo from "react-time-ago";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ShimmerThumbnail } from "react-shimmer-effects";
import Card from "../Card";
import Avatar from "../Avatar";



export default function PartialPostCard({ id, content, created_at, photos, profiles: authorProfile }) {

  return (
    <div className="px-40 mt-5 w-fit">
    <Card>
      <div className="flex gap-3">
        <div>
          <Link href={'/profile'}>
            <span className="cursor-pointer">
              <Avatar url={authorProfile?.avatar} />
            </span>
          </Link>
        </div>
        <div className="grow">
          <p>
            <Link href={'/profile/' + authorProfile?.id}>
              <span className="mr-1 font-semibold cursor-pointer hover:underline">
                {authorProfile?.name}
              </span>
            </Link>
            shared a post
          </p>
          <p className="text-gray-500 text-sm">
            <ReactTimeAgo date={(new Date(created_at)).getTime()} />
          </p>
        </div>
      </div>
      <>
        <div className="flex gap-2 flex-col">
          <p className="my-3 text-sm  flex flex-wrap">{content}</p>
          {photos?.length > 0 && (
            <div className="flex gap-3 h-[400px] w-[800px] justify-center items-center overflow-hidden border">
              {photos.map(photo => (
                <div key={photo} className=" aspect-square flex items-center overflow-hidden relative">
                  <LazyLoadImage effect="blur"  src={photo} alt="photoPost" className="rounded-sm object-fill" />
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    </Card>
    </div>
  );
}