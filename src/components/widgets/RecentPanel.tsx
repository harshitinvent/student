import CardWrapper from '../shared/wrappers/CardWrapper';
import RecentItem from '../shared/RecentItem';

export default function RecentPanel() {
  return (
    <CardWrapper className={'p-12 pb-16'}>
      <CardWrapper.TitleArea title={'Recent'} />

      <div className={'grid gap-4 max-md:mt-16'}>
        <RecentItem to={'/canvas/1'} title={'Photosynthesis'} />
        <RecentItem to={'/canvas/2'} title={'Pythagorean Theorem'} />
        <RecentItem to={'/canvas/3'} title={'Algebra Basics'} />
        <RecentItem to={'/canvas/4'} title={'Foundational Math'} />
      </div>
    </CardWrapper>
  );
}
