import { Calendar, Clock, Users, MapPin } from "lucide-react";

type CourseCardProps = {
  title: string;
  description?: string;
  program?: string;
  sks?: string;
  day?: string;
  time?: string;
  lecturer?: string;
  participants?: number;
  image?: string;
};

export default function CourseCard({
  title,
  description,
  program,
  sks,
  day,
  time,
  lecturer,
  participants,
  image = "https://source.unsplash.com/400x200/?education,technology",
}: CourseCardProps) {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition border border-gray-700">
      {/* Banner Image */}
      <img src={image} alt={title} className="w-full h-32 object-cover" />

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        {program && sks && (
          <p className="text-sm text-gray-300 mb-2">
            {program} | {sks}
          </p>
        )}
        {description && (
          <p className="text-sm text-gray-400 mb-3">{description}</p>
        )}

        {/* Detail Info */}
        <div className="space-y-2 text-sm text-gray-300">
          {day && (
            <div className="flex items-center gap-2">
              <Calendar size={16} /> {day}
            </div>
          )}
          {time && (
            <div className="flex items-center gap-2">
              <Clock size={16} /> {time}
            </div>
          )}
          {lecturer && (
            <div className="flex items-center gap-2">
              <MapPin size={16} /> {lecturer}
            </div>
          )}
          {participants !== undefined && (
            <div className="flex items-center gap-2">
              <Users size={16} /> {participants} Participant
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
