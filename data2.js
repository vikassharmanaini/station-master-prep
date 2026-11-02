// ===== EXPANDED QUESTION BANK (200+) =====
(function(){
  const more = [
   // Mathematics
   {id:'m11',topic:'Mathematics',q:'HCF of 24 and 36 is?',opts:['6','12','18','24'],ans:1,exp:'HCF(24,36)=12.'},
   {id:'m12',topic:'Mathematics',q:'SI on 2000 at 5% for 4 years?',opts:['400','500','600','300'],ans:0,exp:'2000*5*4/100=400.'},
   {id:'m13',topic:'Mathematics',q:'A train 200m long crosses a 300m bridge in 25s. Speed km/h?',opts:['72','60','80','54'],ans:0,exp:'500/25=20 m/s=72 km/h.'},
   {id:'m14',topic:'Mathematics',q:'Compound interest on 1000 at 10% for 2 years?',opts:['210','200','220','190'],ans:0,exp:'1000*1.1^2-1000=210.'},
   {id:'m15',topic:'Mathematics',q:'If 3x+5=20, x=?',opts:['5','3','4','6'],ans:0,exp:'3x=15 → x=5.'},
   {id:'m16',topic:'Mathematics',q:'LCM of 15 and 25?',opts:['75','150','50','25'],ans:0,exp:'LCM=75.'},
   {id:'m17',topic:'Mathematics',q:'Area of square side 12?',opts:['144','124','134','154'],ans:0,exp:'12²=144.'},
   {id:'m18',topic:'Mathematics',q:'Average of first 5 natural numbers?',opts:['3','2.5','4','3.5'],ans:0,exp:'(1+2+3+4+5)/5=3.'},
   {id:'m19',topic:'Mathematics',q:'20% of 250?',opts:['50','40','60','45'],ans:0,exp:'0.2*250=50.'},
   {id:'m20',topic:'Mathematics',q:'Ratio 3:4 as percentage of first?',opts:['75%','60%','80%','66%'],ans:0,exp:'3/4*100=75%.'},
   {id:'m21',topic:'Mathematics',q:'A:B = 2:3, B:C = 4:5. A:C = ?',opts:['8:15','15:8','10:12','6:10'],ans:0,exp:'A:B:C = 8:12:15 → 8:15.'},
   {id:'m22',topic:'Mathematics',q:'Work: A does in 10 days, B in 15 days. Together?',opts:['6 days','5 days','8 days','4 days'],ans:0,exp:'1/10+1/15=1/6.'},
   {id:'m23',topic:'Mathematics',q:'Distance = 240 km, speed = 60 km/h. Time?',opts:['4 h','3 h','5 h','6 h'],ans:0,exp:'240/60=4.'},
   {id:'m24',topic:'Mathematics',q:'Volume of cube side 3?',opts:['27','18','36','9'],ans:0,exp:'3³=27.'},
   {id:'m25',topic:'Mathematics',q:'6th term of AP 3,7,11,...?',opts:['23','19','27','15'],ans:0,exp:'3+5*4=23.'},
   // Basic Science
   {id:'s11',topic:'Basic Science',q:'Unit of energy?',opts:['Joule','Newton','Watt','Pascal'],ans:0,exp:'Joule.'},
   {id:'s12',topic:'Basic Science',q:'Density = mass/volume. Unit?',opts:['kg/m³','N','W','Pa'],ans:0,exp:'kg/m³.'},
   {id:'s13',topic:'Basic Science',q:'Friction opposes?',opts:['Motion','Gravity','Heat','Light'],ans:0,exp:'Motion.'},
   {id:'s14',topic:'Basic Science',q:'Speed is scalar, velocity is?',opts:['Vector','Scalar','Both','None'],ans:0,exp:'Vector.'},
   {id:'s15',topic:'Basic Science',q:'Heat transfer by conduction occurs in?',opts:['Solids','Vacuum','Gases only','Liquids only'],ans:0,exp:'Solids.'},
   {id:'s16',topic:'Basic Science',q:'Resistance unit?',opts:['Ohm','Volt','Ampere','Watt'],ans:0,exp:'Ohm.'},
   {id:'s17',topic:'Basic Science',q:'Lever class with fulcrum between load and effort?',opts:['First class','Second class','Third class','None'],ans:0,exp:'First class lever.'},
   {id:'s18',topic:'Basic Science',q:'Power = Work/Time. Unit?',opts:['Watt','Joule','Newton','Pascal'],ans:0,exp:'Watt.'},
   {id:'s19',topic:'Basic Science',q:'Acceleration due to gravity approx?',opts:['9.8 m/s²','10 m/s','9.8 m/s','10 m/s²'],ans:0,exp:'9.8 m/s².'},
   {id:'s20',topic:'Basic Science',q:'Ohm\'s law: R = ?',opts:['V/I','I/V','V*I','I+V'],ans:0,exp:'R=V/I.'},
   // Data Interpretation
   {id:'d11',topic:'Data Interpretation',q:'If bar shows values 10,20,30,40. Average?',opts:['25','30','20','35'],ans:0,exp:'(10+20+30+40)/4=25.'},
   {id:'d12',topic:'Data Interpretation',q:'Pie: 90° sector of 360° total = ?% of 200',opts:['50','25','75','100'],ans:0,exp:'90/360=25%; 25% of 200=50.'},
   {id:'d13',topic:'Data Interpretation',q:'Table: X=50,Y=30. X is what % of (X+Y)?',opts:['62.5%','50%','37.5%','40%'],ans:0,exp:'50/80*100=62.5.'},
   {id:'d14',topic:'Data Interpretation',q:'Scatter plot shows positive correlation means?',opts:['Both increase together','One increases other decreases','No relation','Constant'],ans:0,exp:'Positive correlation.'},
   {id:'d15',topic:'Data Interpretation',q:'Data sufficiency: Is n even? Stmt1: n/2 integer. Stmt2: n+1 odd. Both?',opts:['Both sufficient','Only 1','Only 2','Neither'],ans:0,exp:'Both sufficient individually.'},
   // Logical Reasoning
   {id:'l11',topic:'Logical Reasoning',q:'All cats are animals. All animals are living. All cats are living?',opts:['True','False','Cannot say','None'],ans:0,exp:'Transitive.'},
   {id:'l12',topic:'Logical Reasoning',q:'Clock at 6:00 angle?',opts:['180°','90°','0°','270°'],ans:0,exp:'|30*6-0|=180.'},
   {id:'l13',topic:'Logical Reasoning',q:'If A>B and B>C then A>C?',opts:['True','False','Maybe','None'],ans:0,exp:'Transitive.'},
   {id:'l14',topic:'Logical Reasoning',q:'Coding: CAT→DBU, DOG→?',opts:['EPH','EPG','FPH','EOH'],ans:0,exp:'+1 each.'},
   {id:'l15',topic:'Logical Reasoning',q:'Assumption: "Take umbrella, it may rain." Assumption: rain is possible?',opts:['Yes','No','Maybe','None'],ans:0,exp:'Implied.'},
   {id:'l16',topic:'Logical Reasoning',q:'Blood: X is Y\'s mother\'s brother. X is?',opts:['Uncle','Father','Brother','Cousin'],ans:0,exp:'Mother\'s brother = uncle.'},
   {id:'l17',topic:'Logical Reasoning',q:'Puzzle: 3 people, A before B, B before C. Order?',opts:['A,B,C','C,B,A','B,A,C','A,C,B'],ans:0,exp:'A,B,C.'},
   // Mental Reasoning
   {id:'r11',topic:'Mental Reasoning',q:'Analogy: Bird:Fly :: Fish:?',opts:['Swim','Walk','Run','Jump'],ans:0,exp:'Fish swims.'},
   {id:'r12',topic:'Mental Reasoning',q:'Series: 3,6,12,24,?',opts:['48','36','30','40'],ans:0,exp:'×2.'},
   {id:'r13',topic:'Mental Reasoning',q:'Coding: if Z=26,Y=25,... A=1, CAB = ?',opts:['3+1+2=6','3+2+1','2+1+3','1+2+3'],ans:0,exp:'C=3,A=1,B=2 →6.'},
   {id:'r14',topic:'Mental Reasoning',q:'Ranking: 4th from top, 6th from bottom. Total?',opts:['9','10','8','11'],ans:0,exp:'4+6-1=9.'},
   {id:'r15',topic:'Mental Reasoning',q:'Analogy: Pen:Write :: Knife:?',opts:['Cut','Cook','Eat','Sharpen'],ans:0,exp:'Knife cuts.'},
   {id:'r16',topic:'Mental Reasoning',q:'Series: 5,10,20,40,?',opts:['80','60','50','70'],ans:0,exp:'×2.'},
   {id:'r17',topic:'Mental Reasoning',q:'Odd one out: 2,4,8,16,32,64,100?',opts:['100','64','32','2'],ans:0,exp:'100 not power of 2.'},
   // Reading Comprehension
   {id:'rc3',topic:'Reading Comprehension',q:'A good title should reflect?',opts:['Main idea','Minor detail','Author name','Date'],ans:0,exp:'Main idea.'},
   {id:'rc4',topic:'Reading Comprehension',q:'Synonym of "rapid" is?',opts:['Fast','Slow','Late','Heavy'],ans:0,exp:'Fast.'},
   {id:'rc5',topic:'Reading Comprehension',q:'Antonym of "increase" is?',opts:['Decrease','Grow','Rise','Expand'],ans:0,exp:'Decrease.'},
   // Basic Science extra
   {id:'s21',topic:'Basic Science',q:'Unit of pressure?',opts:['Pascal','Newton','Watt','Joule'],ans:0,exp:'Pascal.'},
   {id:'s22',topic:'Basic Science',q:'Sound travels fastest in?',opts:['Solids','Liquids','Gases','Vacuum'],ans:0,exp:'Solids.'},
   {id:'s23',topic:'Basic Science',q:'Light travels in straight lines called?',opts:['Rays','Waves','Beams','Lines'],ans:0,exp:'Rays.'},
   {id:'s24',topic:'Basic Science',q:'Mirrors: concave converges, convex?',opts:['Diverges','Converges','Reflects only','None'],ans:0,exp:'Diverges.'},
   {id:'s25',topic:'Basic Science',q:'Magnet: like poles?',opts:['Repel','Attract','No effect','Cancel'],ans:0,exp:'Repel.'},
   // DI extra
   {id:'d16',topic:'Data Interpretation',q:'If total=500 and X=20%, X=?',opts:['100','50','150','200'],ans:0,exp:'0.2*500=100.'},
   {id:'d17',topic:'Data Interpretation',q:'Line graph rising means?',opts:['Increasing trend','Decreasing','Constant','No trend'],ans:0,exp:'Increasing.'},
   {id:'d18',topic:'Data Interpretation',q:'Two sets A={1,2,3}, B={2,3,4}. A∩B?',opts:['{2,3}','{1,4}','{1,2,3,4}','{}'],ans:0,exp:'Intersection {2,3}.'},
   {id:'d19',topic:'Data Interpretation',q:'A∪B for A={1,2},B={3,4}?',opts:['{1,2,3,4}','{1,2}','{3,4}','{}'],ans:0,exp:'Union all.'},
   {id:'d20',topic:'Data Interpretation',q:'Venn: only A if A=10,B=8,both=3?',opts:['7','10','3','5'],ans:0,exp:'10-3=7.'}
  ];
  SM.questions = SM.questions.concat(more);
  // CBAT extra
  SM.cbat = SM.cbat.concat([
    {q:'CBAT is conducted in which languages?',opts:['English & Hindi','All 15','Hindi only','English only'],ans:0},
    {q:'CBAT shortlisting is based on?',opts:['CBT merit','Random','Application date','Age'],ans:0},
    {q:'CBAT has how many test batteries?',opts:['Multiple (RDSO)','1','2','5'],ans:0},
    {q:'CBAT T-score min applies to?',opts:['All categories (no relaxation)','Only UR','SC/ST only','PwBD only'],ans:0}
  ]);
})();
