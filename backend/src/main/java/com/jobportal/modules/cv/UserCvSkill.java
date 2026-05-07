package com.jobportal.modules.cv;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "user_cv_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCvSkill {

    @EmbeddedId
    private UserCvSkillId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("cvId")
    @JoinColumn(name = "cv_id")
    private UserCv cv;

    @Transient
    public Long getSkillId() {
        return id != null ? id.getSkillId() : null;
    }

    @Transient
    public void setSkillId(Long skillId) {
        if (id == null) {
            id = new UserCvSkillId();
        }
        id.setSkillId(skillId);
    }

    @Column(length = 50)
    private String level;

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserCvSkillId implements Serializable {
        private Long cvId;
        private Long skillId;

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            UserCvSkillId that = (UserCvSkillId) o;
            return Objects.equals(cvId, that.cvId) &&
                   Objects.equals(skillId, that.skillId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(cvId, skillId);
        }
    }
}
