/* This example requires Tailwind CSS v2.0+ */
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../firebase/firebaseconfig'; 
import { format, subDays } from 'date-fns'; // You'll need to install date-fns if you haven't already


  
  export default function Example() {
    const [totalApprovedVideos, setTotalApprovedVideos] = useState(0);
    const [totalChannels, setTotalChannels] = useState(0);
    const [totalSubscribers, setTotalSubscribers] = useState(0);
    // const [previousDaySubscribers, setPreviousDaySubscribers] = useState(0);
    // const [totalEditors, setTotalEditors] = useState(0);
    const [basicUsers, setBasicUsers] = useState(0);
    const [standardUsers, setStandardUsers] = useState(0);
    const [premiumUsers, setPremiumUsers] = useState(0);
    const [basicCost, setBasicCost] = useState(0);
    const [standardCost, setStandardCost] = useState(0);
    const [premiumCost, setPremiumCost] = useState(0);
  


    useEffect(() => {
      const db = getDatabase(app);
      const channelsRef = ref(db, 'channels');
      const usersRef = ref(db, 'users');
      let approvedVideosCount = 0;
      let editorsCount = 0;
      let basicCount = 0, standardCount = 0, premiumCount = 0;
      let basicTotalCost = 0, standardTotalCost = 0, premiumTotalCost = 0;
  
      onValue(channelsRef, (channelsSnapshot) => {
        const channels = channelsSnapshot.val();
        const numOfChannels = channels ? Object.keys(channels).length : 0;
        setTotalChannels(numOfChannels);
  
        Object.values(channels).forEach(channel => {
          if (channel.videos) {
            Object.values(channel.videos).forEach(video => {
              if (video.approvalStatus === 'Approved') {
                approvedVideosCount += 1;
              }
            });
          }
          if (channel.editors) {
            editorsCount += Object.keys(channel.editors).length;
          }
        });
        setTotalApprovedVideos(approvedVideosCount);
        // setTotalEditors(editorsCount);
      }, { onlyOnce: true });

      onValue(usersRef, (snapshot) => {
        const users = snapshot.val();
        const numOfUsers = users ? Object.keys(users).length : 0;
        setTotalSubscribers(numOfUsers);
  
        const prevDay = format(subDays(new Date(), 1), 'yyyy-MM-dd');
        let prevDayCount = 0;
  
        Object.values(users).forEach(user => {
          if (user.subscription) {
            if (user.subscription.planType === 'basic') {
              basicCount++;
              basicTotalCost += Number(user.subscription.planPrice);
            } else if (user.subscription.planType === 'standard') {
              standardCount++;
              standardTotalCost += Number(user.subscription.planPrice);
            } else if (user.subscription.planType === 'premium') {
              premiumCount++;
              premiumTotalCost += Number(user.subscription.planPrice);
            }
          }
          if (user.subscriptionDate === prevDay) {
            prevDayCount++;
          }
        });
        // setPreviousDaySubscribers(prevDayCount);
        setBasicUsers(basicCount);
        setStandardUsers(standardCount);
        setPremiumUsers(premiumCount);
        setBasicCost(basicTotalCost);
        setStandardCost(standardTotalCost);
        setPremiumCost(premiumTotalCost);
      });
    }, []);

    const stats = [
      { name: 'Total Subscribers', stat: `${totalSubscribers}` },
      { name: 'Total Channels', stat: `${totalChannels}` },
      { name: 'Total Uploads', stat: `${totalApprovedVideos}` },
      // { name: 'Total Editors', stat: `${totalEditors}` },
      { name: 'Basic Users', stat: `${basicUsers}`, cost: `${basicCost}` },
      { name: 'Standard Users', stat: `${standardUsers}`, cost: `${standardCost}` },
      { name: 'Premium Users', stat: `${premiumUsers}`, cost: `${premiumCost}` },
    ];
  

    return (
      <div>
        {/* <h3 className="text-lg leading-6 font-medium ">Last 30 days</h3> */}
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.name} className="px-4 py-5 border border-[#1f2734] bg-neutral-950 shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-md Gilroy-Medium text-[#828a95] truncate">{item.name}</dt>
              <dd className="mt-1 text-4xl Gilroy-SemiBold text-white">{item.stat}</dd>
            </div>
          ))}
        </dl>
      </div>
    )
  }
  