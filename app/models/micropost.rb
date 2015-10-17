class Micropost < ActiveRecord::Base
  belongs_to :user
  default_scope -> { order(created_at: :desc) }
  mount_uploader :picture, PictureUploader
  validates :user_id, presence: true
  validates :content, presence: true, length: { maximum: 140 }
  validate :picture_size

  private
    # validate upload picture size
    def picture_size
      if picture.size > 1.megabyte
        errors.add(:picture, "の上限サイズは1MBです。")
      end
    end
end
